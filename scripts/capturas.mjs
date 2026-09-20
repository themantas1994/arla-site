/** Gera as capturas de ecrã usadas na revisão visual e na documentação. */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1]
  : 'http://localhost:4321';
const SO = process.argv.includes('--so') ? process.argv[process.argv.indexOf('--so') + 1] : null;

const PAGINAS = [
  ['inicio', '/', false],
  ['repetidores', '/rede/repetidores/', true],
  ['artigo-tecnico', '/tecnica/qo-100-como-receber/', true],
  ['eventos', '/eventos/', false],
  ['ser-associado', '/arla/ser-associado/', true],
  ['contactos', '/contactos/', true],
  ['comecar', '/radioamadorismo/comecar/', false],
  ['historia', '/arla/historia/', false],
  ['noticias', '/noticias/', false],
  ['orgaos-sociais', '/arla/orgaos-sociais/', true],
  ['rede', '/rede/', true],
  ['mapa-rede', '/rede/mapa/', false],
  ['documentos', '/recursos/documentos/', true],
  ['faq', '/recursos/faq/', true],
  ['pesquisa', '/pesquisa/', false],
  ['404', '/404.html', false],
];
const ECRAS = [[1440, 1000, 'desktop'], [768, 1024, 'tablet'], [390, 844, 'telemovel']];

await mkdir('reports/capturas', { recursive: true });
const CHROMIUM = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const b = await chromium.launch(existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {});
let n = 0;

for (const [largura, altura, rotulo] of ECRAS) {
  for (const tema of ['escuro', 'claro']) {
    // Só o essencial em tablet/telemóvel e no tema claro, para não gerar centenas de ficheiros.
    const ctx = await b.newContext({
      viewport: { width: largura, height: altura },
      ignoreHTTPSErrors: true,
      colorScheme: tema === 'claro' ? 'light' : 'dark',
      deviceScaleFactor: 1,
    });
    const p = await ctx.newPage();
    await p.addInitScript((t) => { try { localStorage.setItem('arla-tema', t); } catch {} }, tema);

    for (const [nome, rota, inteira] of PAGINAS) {
      if (SO && nome !== SO) continue;
      if (rotulo !== 'desktop' && !['inicio', 'repetidores', 'contactos', 'eventos', 'noticias'].includes(nome)) continue;
      if (tema === 'claro' && !['inicio', 'repetidores', 'artigo-tecnico', 'eventos'].includes(nome)) continue;
      await p.goto(BASE + rota, { waitUntil: 'networkidle' });
      await p.waitForTimeout(450);
      await p.screenshot({
        path: `reports/capturas/${nome}-${rotulo}-${tema}.png`,
        fullPage: inteira,
      });
      n++;
    }
    await ctx.close();
  }
}
await b.close();
console.log(`${n} capturas em reports/capturas/`);
