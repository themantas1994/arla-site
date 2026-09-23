/**
 * Valida o sistema de redireções.
 *
 * Verifica, pela ordem por que o faz:
 *   1. Coerência da fonte (src/lib/redirects.mjs)
 *      - origens e destinos com forma válida
 *      - origens duplicadas entre os três mapas
 *      - auto-redireções, ciclos e cadeias (A → B em que B também é origem)
 *   2. Concordância com o que os ficheiros de servidor contêm
 *      - .htaccess e _redirects gerados a partir da mesma fonte e em dia
 *      - nenhuma regra a mais, a menos ou com destino diferente
 *      - sem regras duplicadas dentro de cada ficheiro
 *   3. Destinos que o Astro tem de saber servir
 *      - rotas de `redirects` apontam para caminhos com barra final
 *      - ficheiros de `redirecoesDeFicheiros` existem em public/
 *
 * Uso: node scripts/validar-redirecoes.mjs
 */
import { readFile, access } from 'node:fs/promises';
import { redirects, redirecoesDeFicheiros, capturaFinal } from '../src/lib/redirects.mjs';
import { padraoApache, regras } from './lib/redirecoes.mjs';

const problemas = [];
const avisos = [];
const erro = (categoria, msg) => problemas.push({ categoria, msg });
const aviso = (categoria, msg) => avisos.push({ categoria, msg });

const TODAS = regras();

/* ------------------------------------------------ 1. Coerência da fonte --- */

// Origens duplicadas entre os três mapas.
const vistas = new Map();
for (const r of TODAS) {
  if (vistas.has(r.origem)) {
    erro('duplicados', `origem repetida em ${vistas.get(r.origem)} e ${r.tipo}: ${r.origem}`);
  }
  vistas.set(r.origem, r.tipo);
}

// Forma das origens e dos destinos.
for (const r of TODAS) {
  if (!r.origem.startsWith('/')) erro('origem inválida', `não começa em "/": ${r.origem}`);
  if (/\s/.test(r.origem)) erro('origem inválida', `tem espaços: ${JSON.stringify(r.origem)}`);
  if (/^https?:/i.test(r.origem)) erro('origem inválida', `é um endereço absoluto: ${r.origem}`);
  if (r.tipo !== 'captura' && r.origem.includes('*')) {
    erro('origem inválida', `só a recolha final pode ter "*": ${r.origem}`);
  }

  const d = r.destino;
  if (!d) erro('destino inválido', `destino vazio em ${r.origem}`);
  else if (!d.startsWith('/') && !/^https?:\/\//i.test(d)) {
    erro('destino inválido', `${r.origem} → ${d} (tem de começar em "/" ou em http)`);
  }
  if (/\s/.test(d)) erro('destino inválido', `destino com espaços em ${r.origem}: ${JSON.stringify(d)}`);
  if (r.origem === d) erro('auto-redireção', `${r.origem} redireciona para si própria`);

  if (![301, 302, 307, 308].includes(r.status)) {
    erro('estado inválido', `${r.origem} usa status ${r.status}`);
  }
}

// Cadeias e ciclos: um destino que também seja origem de outra regra.
// A recolha final fica de fora: é um padrão, não um caminho concreto.
const origens = new Map(TODAS.filter((r) => r.tipo !== 'captura').map((r) => [r.origem, r.destino]));
for (const [origem, destino] of origens) {
  if (!origens.has(destino)) continue;
  const seguinte = origens.get(destino);
  if (seguinte === origem) erro('ciclo', `${origem} → ${destino} → ${origem}`);
  else erro('cadeia', `${origem} → ${destino} → ${seguinte} (o destino é origem de outra regra)`);
}

// O padrão da recolha final tem de apanhar o prefixo antigo, e mais nada.
if (!capturaFinal.origem.startsWith('/site/')) {
  erro('recolha final', `a recolha final devia apanhar /site/, apanha ${capturaFinal.origem}`);
}
if (TODAS.at(-1)?.tipo !== 'captura') {
  erro('recolha final', 'a recolha final não é a última regra: as específicas deixariam de ganhar');
}

/* ------------------------------ 2. Concordância dos ficheiros gerados ----- */

const htaccess = await readFile('public/.htaccess', 'utf8');
const redirectsTxt = await readFile('public/_redirects', 'utf8');

const naHtaccess = new Map();
for (const linha of htaccess.split('\n')) {
  const m = linha.match(/^\s*RewriteRule\s+(\S+)\s+(\S+)\s+\[R=(\d+),L\]/);
  if (!m) continue;
  if (naHtaccess.has(m[1])) erro('duplicados', `.htaccess tem duas regras para ${m[1]}`);
  naHtaccess.set(m[1], { destino: m[2], status: Number(m[3]) });
}

const noRedirects = new Map();
for (const linha of redirectsTxt.split('\n')) {
  const t = linha.trim();
  if (!t || t.startsWith('#')) continue;
  const [origem, destino, status] = t.split(/\s+/);
  if (noRedirects.has(origem)) erro('duplicados', `_redirects tem duas regras para ${origem}`);
  noRedirects.set(origem, { destino, status: Number(status) });
}

for (const r of TODAS) {
  const padrao = padraoApache(r);
  const h = naHtaccess.get(padrao);
  if (!h) erro('em falta', `.htaccess não tem regra para ${r.origem} (padrão ${padrao})`);
  else if (h.destino !== r.destino) {
    erro('destino diferente', `.htaccess: ${r.origem} → ${h.destino}, esperado ${r.destino}`);
  } else if (h.status !== r.status) {
    erro('estado diferente', `.htaccess: ${r.origem} usa ${h.status}, esperado ${r.status}`);
  }

  const n = noRedirects.get(r.origem);
  if (!n) erro('em falta', `_redirects não tem regra para ${r.origem}`);
  else if (n.destino !== r.destino) {
    erro('destino diferente', `_redirects: ${r.origem} → ${n.destino}, esperado ${r.destino}`);
  } else if (n.status !== r.status) {
    erro('estado diferente', `_redirects: ${r.origem} usa ${n.status}, esperado ${r.status}`);
  }
}

const padroesEsperados = new Set(TODAS.map(padraoApache));
for (const p of naHtaccess.keys()) {
  if (!padroesEsperados.has(p)) erro('a mais', `.htaccess tem uma regra sem fonte: ${p}`);
}
const origensEsperadas = new Set(TODAS.map((r) => r.origem));
for (const o of noRedirects.keys()) {
  if (!origensEsperadas.has(o)) erro('a mais', `_redirects tem uma regra sem fonte: ${o}`);
}

// As secções mantidas à mão no .htaccess não podem desaparecer.
for (const marca of ['Strict-Transport-Security', 'Cache-Control', 'ErrorDocument 404']) {
  if (!htaccess.includes(marca)) erro('secção perdida', `.htaccess já não tem ${marca}`);
}

/* ---------------------------------------- 3. Destinos que têm de existir -- */

for (const [origem, r] of Object.entries(redirects)) {
  const d = r.destination;
  if (d.startsWith('/') && !d.endsWith('/') && !/\.[a-z0-9]+$/i.test(d)) {
    aviso('barra final', `${origem} → ${d} (o sítio usa trailingSlash: 'always')`);
  }
}

for (const [origem, r] of Object.entries(redirecoesDeFicheiros)) {
  const d = r.destination;
  if (!d.startsWith('/')) continue;
  try {
    await access(`public${d}`);
  } catch {
    erro('ficheiro em falta', `${origem} → ${d}, mas public${d} não existe`);
  }
}

/* --------------------------------------------------------------- Resumo --- */

const porTipo = TODAS.reduce((c, r) => ({ ...c, [r.tipo]: (c[r.tipo] ?? 0) + 1 }), {});
console.log('══ REDIREÇÕES ══');
console.log(`Fonte única:      src/lib/redirects.mjs`);
console.log(`Regras:           ${TODAS.length} (${porTipo.rota} rotas + ${porTipo.ficheiro} ficheiros + ${porTipo.captura} recolha)`);
console.log(`public/.htaccess: ${naHtaccess.size} regras`);
console.log(`public/_redirects:${String(noRedirects.size).padStart(4)} regras`);
console.log('');

if (avisos.length) {
  console.log(`⚠ ${avisos.length} avisos:`);
  for (const a of avisos) console.log(`  [${a.categoria}] ${a.msg}`);
  console.log('');
}

if (problemas.length === 0) {
  console.log('✓ Sem regras em falta, duplicadas, em ciclo, em cadeia ou com destino diferente.');
  process.exit(0);
}

console.log(`✗ ${problemas.length} problemas:`);
for (const p of problemas) console.log(`  [${p.categoria}] ${p.msg}`);
console.log('\nSe forem diferenças entre a fonte e os ficheiros: npm run redirecoes:gerar');
process.exit(1);
