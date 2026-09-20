/**
 * Auditoria de desempenho: pesos transferidos, Core Web Vitals reais medidos
 * num navegador e simulação de ligação móvel.
 *
 * Uso: node scripts/auditar-desempenho.mjs [--url http://localhost:4321] [--json ficheiro]
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { writeFile, mkdir } from 'node:fs/promises';

const BASE = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1]
  : 'http://localhost:4321';
const jsonIdx = process.argv.indexOf('--json');
const saida = jsonIdx > -1 ? process.argv[jsonIdx + 1] : null;

const PAGINAS = [
  ['Início', '/'],
  ['Repetidores', '/rede/repetidores/'],
  ['Notícias', '/noticias/'],
  ['Artigo técnico longo', '/tecnica/modos-digitais-para-o-qo-100/'],
  ['Eventos', '/eventos/'],
  ['Contactos (com mapa)', '/contactos/'],
  ['Ser associado/a', '/arla/ser-associado/'],
  ['Quero começar', '/radioamadorismo/comecar/'],
];

const CHROMIUM = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {});
const resultados = [];

for (const [nome, rota] of PAGINAS) {
  const ctx = await navegador.newContext({
    viewport: { width: 390, height: 844 },
    ignoreHTTPSErrors: true,
  });
  const pagina = await ctx.newPage();

  // Rede móvel realista: 4G lento (1.6 Mbit/s, 150 ms de latência) e CPU 4× mais lento.
  const cdp = await ctx.newCDPSession(pagina);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const recursos = { documento: 0, css: 0, js: 0, imagem: 0, tipo: 0, outro: 0 };
  let total = 0, pedidos = 0, terceiros = 0;
  pagina.on('response', async (r) => {
    pedidos++;
    try {
      const url = new URL(r.url());
      if (!url.href.startsWith(BASE)) terceiros++;
      const tam = Number(r.headers()['content-length'] ?? 0) || (await r.body().catch(() => Buffer.alloc(0))).length;
      total += tam;
      const t = r.request().resourceType();
      const chave = { document: 'documento', stylesheet: 'css', script: 'js', image: 'imagem', font: 'tipo' }[t] ?? 'outro';
      recursos[chave] += tam;
    } catch { /* recurso descartado */ }
  });

  await pagina.goto(BASE + rota, { waitUntil: 'load' });

  // LCP e CLS medidos com PerformanceObserver, como fazem as ferramentas de campo.
  const vitais = await pagina.evaluate(async () => {
    const espera = (ms) => new Promise((r) => setTimeout(r, ms));
    let lcp = 0, cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });

    await espera(2500);
    const nav = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
    return {
      lcp: Math.round(lcp),
      cls: Number(cls.toFixed(4)),
      fcp: Math.round(fcp),
      ttfb: Math.round(nav?.responseStart ?? 0),
      domInterativo: Math.round(nav?.domInteractive ?? 0),
      carregado: Math.round(nav?.loadEventEnd ?? 0),
    };
  });

  const nos = await pagina.evaluate(() => document.querySelectorAll('*').length);
  resultados.push({ nome, rota, ...vitais, pedidos, terceiros, totalKB: Math.round(total / 1024), recursos, nos });
  await ctx.close();
}

await navegador.close();

const kb = (b) => Math.round(b / 1024);
const nota = (v, bom, razoavel) => (v <= bom ? '✓' : v <= razoavel ? '~' : '✗');

console.log('Condições: 390px, 4G lento (1,6 Mbit/s, 150 ms), CPU 4× mais lento, cache fria.\n');
console.log('Página                    │ Peso  │ Pedidos │   LCP │   FCP │    CLS │ Nós');
console.log('──────────────────────────┼───────┼─────────┼───────┼───────┼────────┼─────');
for (const r of resultados) {
  console.log(
    `${r.nome.padEnd(25)} │ ${String(r.totalKB + ' kB').padStart(5)} │ ${String(r.pedidos).padStart(7)} │ ` +
    `${String(r.lcp + 'ms').padStart(6)}${nota(r.lcp, 2500, 4000)} │ ${String(r.fcp + 'ms').padStart(5)} │ ` +
    `${String(r.cls).padStart(6)}${nota(r.cls, 0.1, 0.25)} │ ${String(r.nos).padStart(4)}`,
  );
}

console.log('\nLimiares de referência (Core Web Vitals):  LCP ≤ 2500 ms · CLS ≤ 0,1');
console.log('✓ bom   ~ a melhorar   ✗ mau\n');

const inicio = resultados[0];
console.log('Repartição do peso da página inicial:');
for (const [k, v] of Object.entries(inicio.recursos)) {
  if (v > 0) console.log(`  ${k.padEnd(10)} ${String(kb(v)).padStart(5)} kB`);
}
console.log(`  ${'terceiros'.padEnd(10)} ${inicio.terceiros} pedidos`);

const maus = resultados.filter((r) => r.lcp > 2500 || r.cls > 0.1);
console.log(maus.length === 0
  ? '\n✓ Todas as páginas dentro dos limiares de Core Web Vitals.'
  : `\n✗ ${maus.length} páginas fora dos limiares: ${maus.map((m) => m.nome).join(', ')}`);

if (saida) {
  await mkdir('reports', { recursive: true });
  await writeFile(saida, JSON.stringify(resultados, null, 2));
}
