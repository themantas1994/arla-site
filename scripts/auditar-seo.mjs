/**
 * Auditoria de SEO sobre o build estático: metadados, dados estruturados,
 * hierarquia de títulos, textos alternativos e sitemap.
 *
 * Uso: node scripts/auditar-seo.mjs [--json reports/seo.json]
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const jsonIdx = process.argv.indexOf('--json');
const saida = jsonIdx > -1 ? process.argv[jsonIdx + 1] : null;

async function html(dir) {
  const r = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) r.push(...(await html(p)));
    else if (e.name.endsWith('.html')) r.push(p);
  }
  return r;
}

const todas = await html(DIST);
const problemas = [];
const avisos = [];
const tipos = new Map();
let analisadas = 0, semIndexacao = 0, vazias = 0;

const etiqueta = (s, re) => s.match(re)?.[1];

for (const f of todas) {
  const s = await readFile(f, 'utf8');
  if (/http-equiv="refresh"/.test(s)) continue;   // stub de redireção
  const rota = '/' + path.relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');
  if (rota.startsWith('/admin/')) continue;       // painel do CMS, fora do sítio público
  analisadas++;
  if (/name="robots" content="noindex/.test(s)) { semIndexacao++; }

  const titulo = etiqueta(s, /<title>([^<]*)<\/title>/);
  const descricao = etiqueta(s, /<meta name="description" content="([^"]*)"/);
  const canonico = etiqueta(s, /<link rel="canonical" href="([^"]*)"/);
  const ogTitulo = etiqueta(s, /<meta property="og:title" content="([^"]*)"/);
  const ogImagem = etiqueta(s, /<meta property="og:image" content="([^"]*)"/);
  const lang = etiqueta(s, /<html lang="([^"]*)"/);

  const regista = (o) => problemas.push({ rota, ...o });
  if (!titulo) regista({ campo: 'title', erro: 'em falta' });
  // Títulos longos são apenas um aviso: alguns nomes de eventos são mesmo assim,
  // e encurtá-los artificialmente perderia informação.
  else if (titulo.length > 65) avisos.push({ rota, campo: 'title', nota: `${titulo.length} caracteres — o Google trunca por volta dos 60`, valor: titulo });
  if (!descricao) regista({ campo: 'description', erro: 'em falta' });
  else if (descricao.length < 50) regista({ campo: 'description', erro: `${descricao.length} caracteres (<50)`, valor: descricao });
  else if (descricao.length > 165) regista({ campo: 'description', erro: `${descricao.length} caracteres (>165)`, valor: descricao.slice(0, 80) + '…' });
  if (!canonico) regista({ campo: 'canonical', erro: 'em falta' });
  if (!ogTitulo) regista({ campo: 'og:title', erro: 'em falta' });
  if (!ogImagem) regista({ campo: 'og:image', erro: 'em falta' });
  if (lang !== 'pt-PT') regista({ campo: 'html lang', erro: `«${lang}», esperado pt-PT` });

  // Um e só um <h1>
  const h1 = [...s.matchAll(/<h1[\s>]/g)].length;
  if (h1 !== 1) regista({ campo: 'h1', erro: `${h1} elementos h1` });

  // Imagens sem atributo alt de todo. Um alt vazio (alt="" ou alt) é válido e
  // significa «decorativa»; contam-se à parte, como aviso.
  const semAtributo = [...s.matchAll(/<img\b(?![^>]*[\s]alt[\s=>])[^>]*>/g)];
  if (semAtributo.length) regista({ campo: 'img alt', erro: `${semAtributo.length} imagens sem atributo alt`, valor: semAtributo[0][0].slice(0, 90) });
  const altVazio = [...s.matchAll(/<img\b[^>]*\salt(?:=""|(?=[\s>]))[^>]*>/g)];
  if (altVazio.length) vazias += altVazio.length;

  // Dados estruturados
  for (const m of s.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const d = JSON.parse(m[1]);
      for (const bloco of Array.isArray(d) ? d : [d]) {
        const t = bloco['@type'];
        if (t) tipos.set(t, (tipos.get(t) ?? 0) + 1);
      }
    } catch (e) {
      regista({ campo: 'JSON-LD', erro: 'JSON inválido' });
    }
  }
}

const sitemap = await readFile(path.join(DIST, 'sitemap-0.xml'), 'utf8').catch(() => '');
const nSitemap = [...sitemap.matchAll(/<loc>/g)].length;
const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8').catch(() => '');

const relatorio = { analisadas, semIndexacao, problemas, avisos, imagensComAltVazio: vazias, tipos: Object.fromEntries(tipos), nSitemap };

console.log(`Páginas indexáveis analisadas: ${analisadas} (${semIndexacao} com noindex)`);
console.log(`Endereços no sitemap:          ${nSitemap}`);
console.log(`robots.txt:                    ${robots ? 'presente' : 'EM FALTA'}`);
console.log('\nDados estruturados (JSON-LD):');
for (const [t, n] of [...tipos].sort((a, b) => b[1] - a[1])) console.log(`  ${t.padEnd(18)} ${n}`);
console.log('');
if (problemas.length === 0) console.log('✓ Sem problemas de SEO.');
else {
  console.log(`✗ ${problemas.length} problemas:`);
  for (const p of problemas.slice(0, 40)) {
    console.log(`  ${p.rota} — ${p.campo}: ${p.erro}${p.valor ? `\n      ${p.valor}` : ''}`);
  }
  if (problemas.length > 40) console.log(`  … e mais ${problemas.length - 40}`);
}
console.log('');
if (avisos.length) {
  console.log(`⚠ ${avisos.length} avisos (não bloqueiam):`);
  const porCampo = new Map();
  for (const a of avisos) porCampo.set(a.campo, (porCampo.get(a.campo) ?? 0) + 1);
  for (const [c, n] of porCampo) console.log(`  ${c}: ${n} páginas`);
}
console.log(`\nImagens com alt vazio (decorativas ou por descrever): ${vazias} ocorrências`);

if (saida) await writeFile(saida, JSON.stringify(relatorio, null, 2));
process.exit(problemas.length > 0 ? 1 : 0);
