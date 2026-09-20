/**
 * Verificador de ligações sobre o build estático (dist/).
 *
 * - Ligações internas: resolvidas contra os ficheiros gerados.
 * - Âncoras (#id): verificadas contra os ids existentes na página de destino.
 * - Ligações externas: testadas por HEAD (com GET de reserva), com concorrência limitada.
 *
 * Uso: node scripts/check-links.mjs [--externas] [--json relatorio.json]
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const verificarExternas = process.argv.includes('--externas');
/** Origem canónica do próprio sítio: aparece em canonical/OG e não é uma ligação externa. */
const ORIGEM_PROPRIA = process.env.PUBLIC_SITE_URL || 'https://www.cs5arla.pt';
const jsonIdx = process.argv.indexOf('--json');
const jsonSaida = jsonIdx > -1 ? process.argv[jsonIdx + 1] : null;

async function htmlFiles(dir) {
  const saida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) saida.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) saida.push(p);
  }
  return saida;
}

const paginas = await htmlFiles(DIST);
const conteudo = new Map();
const idsPorPagina = new Map();

for (const f of paginas) {
  const html = await readFile(f, 'utf8');
  conteudo.set(f, html);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  idsPorPagina.set(f, ids);
}

/** Converte um caminho de URL no ficheiro que o serve. */
function ficheiroDe(urlPath) {
  const limpo = decodeURIComponent(urlPath.split('?')[0]);
  const candidatos = [
    path.join(DIST, limpo, 'index.html'),
    path.join(DIST, limpo),
    path.join(DIST, limpo.replace(/\/$/, '') + '.html'),
  ];
  return candidatos;
}

async function existe(p) {
  try { await stat(p); return true; } catch { return false; }
}

const partidas = [];
const externasVistas = new Map();
let totalInternas = 0, totalExternas = 0, totalAncoras = 0;

for (const f of paginas) {
  const html = conteudo.get(f);
  const daPagina = '/' + path.relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');
  // Os stubs de redireção apontam de propósito para fora da sua própria árvore.
  const eRedirecao = /http-equiv="refresh"/.test(html);

  const alvos = new Set();
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) alvos.add(m[1]);

  for (const alvo of alvos) {
    if (!alvo || alvo.startsWith('data:') || alvo.startsWith('mailto:') ||
        alvo.startsWith('tel:') || alvo.startsWith('javascript:')) continue;

    if (alvo.startsWith(ORIGEM_PROPRIA)) continue; // canónico/OG do próprio sítio

    if (/^https?:\/\//.test(alvo)) {
      totalExternas++;
      if (!externasVistas.has(alvo)) externasVistas.set(alvo, []);
      externasVistas.get(alvo).push(daPagina);
      continue;
    }

    if (alvo.startsWith('#')) {
      totalAncoras++;
      const id = decodeURIComponent(alvo.slice(1));
      if (id && !idsPorPagina.get(f).has(id)) {
        partidas.push({ tipo: 'ancora', de: daPagina, alvo, motivo: 'id inexistente na página' });
      }
      continue;
    }

    if (!alvo.startsWith('/')) continue; // relativas: não usadas neste projeto
    totalInternas++;

    const [caminho, ancora] = alvo.split('#');
    const candidatos = ficheiroDe(caminho);
    let encontrado = null;
    for (const c of candidatos) if (await existe(c)) { encontrado = c; break; }

    if (!encontrado) {
      partidas.push({ tipo: 'interna', de: daPagina, alvo, motivo: 'ficheiro inexistente em dist' });
    } else if (ancora && encontrado.endsWith('.html') && !eRedirecao) {
      const ids = idsPorPagina.get(encontrado);
      if (ids && !ids.has(decodeURIComponent(ancora))) {
        partidas.push({ tipo: 'ancora', de: daPagina, alvo, motivo: 'id inexistente na página de destino' });
      }
    }
  }
}

const externas = [];
if (verificarExternas) {
  const urls = [...externasVistas.keys()];
  const LOTE = 6;
  for (let i = 0; i < urls.length; i += LOTE) {
    await Promise.all(urls.slice(i, i + LOTE).map(async (url) => {
      let estado = 0, erro = null;
      for (const metodo of ['HEAD', 'GET']) {
        try {
          const c = new AbortController();
          const t = setTimeout(() => c.abort(), 20000);
          const r = await fetch(url, { method: metodo, redirect: 'follow', signal: c.signal });
          clearTimeout(t);
          estado = r.status;
          if (r.ok) break;
        } catch (e) { erro = String(e.message ?? e); }
      }
      externas.push({ url, estado, erro, paginas: externasVistas.get(url) });
      if (estado === 0 || estado >= 400) {
        partidas.push({ tipo: 'externa', de: externasVistas.get(url)[0], alvo: url, motivo: erro ?? `HTTP ${estado}` });
      }
    }));
  }
}

const relatorio = {
  paginas: paginas.length,
  ligacoesInternas: totalInternas,
  ancoras: totalAncoras,
  ligacoesExternas: externasVistas.size,
  ocorrenciasExternas: totalExternas,
  partidas,
  externas,
};

console.log(`Páginas analisadas:   ${paginas.length}`);
console.log(`Ligações internas:    ${totalInternas}`);
console.log(`Âncoras:              ${totalAncoras}`);
console.log(`Ligações externas:    ${externasVistas.size} distintas (${totalExternas} ocorrências)`);
console.log(verificarExternas ? '(externas verificadas)' : '(externas não verificadas — use --externas)');
console.log('');
if (partidas.length === 0) {
  console.log('✓ Nenhuma ligação partida.');
} else {
  console.log(`✗ ${partidas.length} ligações com problema:`);
  for (const p of partidas) console.log(`  [${p.tipo}] ${p.de} → ${p.alvo}  (${p.motivo})`);
}

if (jsonSaida) await writeFile(jsonSaida, JSON.stringify(relatorio, null, 2));
process.exit(partidas.filter((p) => p.tipo !== 'externa').length > 0 ? 1 : 0);
