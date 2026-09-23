/**
 * Testa a Content-Security-Policy contra o sítio real, antes de a impor.
 *
 * A política de `scripts/lib/csp.mjs` é servida em `Report-Only` no
 * `.htaccess` — não bloqueia nada, e por isso também não prova nada. Este
 * guião aplica-a em modo de IMPOSIÇÃO num navegador (interceta cada resposta
 * HTML e injeta o cabeçalho), percorre as páginas com mais dependências
 * externas e conta o que ficaria bloqueado.
 *
 * Sair com 0 significa: se a política passar a impositiva, nada se parte.
 *
 * Uso: node scripts/auditar-csp.mjs [--url http://localhost:4321]
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { politica } from './lib/csp.mjs';

const POLITICA = politica();

// O .htaccess traz uma cópia da política. Se divergir, este guião estaria a
// testar uma coisa e o servidor a servir outra — e ninguém daria por isso.
const htaccess = await readFile('public/.htaccess', 'utf8');
const noServidor = htaccess.match(
  /Header always set Content-Security-Policy(?:-Report-Only)? "([^"]*)"/,
)?.[1];
if (!noServidor) {
  console.error('✗ public/.htaccess não serve nenhuma Content-Security-Policy.');
  process.exit(1);
}
if (noServidor !== POLITICA) {
  console.error('✗ A política no .htaccess não é a de scripts/lib/csp.mjs.');
  console.error(`  .htaccess: ${noServidor}`);
  console.error(`  csp.mjs:   ${POLITICA}`);
  process.exit(1);
}
const impositiva = /Header always set Content-Security-Policy "/.test(htaccess);

const BASE = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1]
  : 'http://localhost:4321';

/** As páginas que carregam alguma coisa de fora, mais uma amostra das outras. */
const PAGINAS = [
  ['inicio', '/'],
  ['mapa-rede', '/rede/mapa/'],
  ['contactos', '/contactos/'],
  ['repetidores', '/rede/repetidores/'],
  ['balizas', '/rede/balizas/'],
  ['meteorologia', '/radioamadorismo/meteorologia-espacial/'],
  ['pesquisa', '/pesquisa/'],
  ['noticias', '/noticias/'],
  ['noticia', '/noticias/estacao-de-rececao-ais-shipxplorer/'],
  ['artigo-tecnico', '/tecnica/modos-digitais-para-o-qo-100/'],
  ['evento', '/eventos/12a-edicao-fim-de-semana-am/'],
  ['arquivo', '/arquivo/'],
  ['documentos', '/recursos/documentos/'],
  ['admin', '/admin/'],
  ['404', '/404.html'],
];

const CHROMIUM = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {});
const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 }, ignoreHTTPSErrors: true });

// Injeta a política em modo impositivo em cada documento HTML servido.
await ctx.route(`${BASE}/**`, async (rota) => {
  const resposta = await rota.fetch();
  const tipo = resposta.headers()['content-type'] ?? '';
  if (!tipo.includes('text/html')) return rota.fulfill({ response: resposta });
  return rota.fulfill({
    response: resposta,
    headers: { ...resposta.headers(), 'content-security-policy': POLITICA },
  });
});

const pagina = await ctx.newPage();
const violacoes = [];
pagina.on('console', (m) => {
  const t = m.text();
  if (/Content Security Policy|Refused to/i.test(t)) violacoes.push({ texto: t });
});

console.log('══ CONTENT-SECURITY-POLICY ══');
console.log(`No .htaccess: ${impositiva ? 'IMPOSITIVA' : 'Report-Only (não bloqueia nada)'}`);
console.log('Política testada aqui em modo IMPOSITIVO:');
console.log(`  ${POLITICA}`);
console.log('');

let comProblema = 0;
for (const [nome, rota] of PAGINAS) {
  const antes = violacoes.length;
  await pagina.goto(BASE + rota, { waitUntil: 'networkidle' }).catch(() => {});
  await pagina.waitForTimeout(700);
  const novas = violacoes.slice(antes);
  if (novas.length) {
    comProblema++;
    console.log(`✗ ${nome} (${rota}) — ${novas.length} violações:`);
    for (const v of novas.slice(0, 5)) console.log(`    ${v.texto.slice(0, 200)}`);
  } else {
    console.log(`✓ ${nome} (${rota})`);
  }
}

await navegador.close();

console.log('');
if (comProblema === 0) {
  console.log(`✓ ${PAGINAS.length} páginas sem uma única violação com a política imposta.`);
  console.log('  A política pode passar de Report-Only a impositiva no .htaccess.');
  process.exit(0);
}
console.log(`✗ ${comProblema} páginas partem-se se a política for imposta. Mantenha Report-Only.`);
process.exit(1);
