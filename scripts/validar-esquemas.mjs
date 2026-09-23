/**
 * Concordância entre o CMS e os esquemas de conteúdo (DT-002).
 *
 * `public/admin/config.yml` e `src/content.config.ts` descrevem os mesmos
 * dados em linguagens diferentes. Sem verificação, o Decap deixa gravar
 * conteúdo que o build do Astro depois recusa — e quem editou só descobre
 * quando o sítio deixa de compilar.
 *
 * Isto compara os dois ficheiros e assinala:
 *   - coleções do CMS sem coleção de conteúdo correspondente
 *   - campos obrigatórios do esquema que o CMS não oferece
 *   - campos obrigatórios no esquema mas opcionais no CMS
 *   - campos que o CMS oferece e o esquema não conhece
 *   - valores de `select` fora do `z.enum()` correspondente
 *   - caminhos de media que não correspondem ao que o esquema espera
 *
 * O esquema é lido por análise de texto de `src/content.config.ts`: não se
 * carrega o módulo porque ele depende de `astro:content`, que só existe
 * durante o build. É deliberadamente conservador — na dúvida, não acusa.
 *
 * Uso: node scripts/validar-esquemas.mjs
 */
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parse } from 'yaml';

const correr = promisify(execFile);

const problemas = [];
const avisos = [];
const erro = (c, m) => problemas.push({ c, m });
const aviso = (c, m) => avisos.push({ c, m });

const cms = parse(await readFile('public/admin/config.yml', 'utf8'));
const fonte = await readFile('src/content.config.ts', 'utf8');

/* ------------------------------------------- Esquemas de content.config --- */

/** Texto entre `abre` e o `fecha` que lhe corresponde, a partir de `i`. */
function equilibrado(texto, i, abre, fecha) {
  const inicio = texto.indexOf(abre, i);
  if (inicio === -1) return null;
  let nivel = 0;
  for (let j = inicio; j < texto.length; j++) {
    if (texto[j] === abre) nivel++;
    else if (texto[j] === fecha && --nivel === 0) return texto.slice(inicio + 1, j);
  }
  return null;
}

/** Corpo do objeto `baseArtigo`, partilhado por notícias, técnica e eventos. */
const BASE_ARTIGO = equilibrado(fonte, fonte.indexOf('const baseArtigo = {'), '{', '}') ?? '';

/** Lista de cadeias de um `z.enum([...])`, ou null se não for um enum. */
function valoresEnum(def) {
  const m = def.match(/z\.enum\(\[([^\]]*)\]\)/);
  return m ? [...m[1].matchAll(/'([^']*)'/g)].map((v) => v[1]) : null;
}

const ESTADO_OPERACIONAL = valoresEnum(
  fonte.slice(fonte.indexOf('const estadoOperacional =')).split('\n')[0],
);

/**
 * Campos de primeiro nível de um corpo de objeto: nome → { obrigatorio, valores }.
 * Percorre o texto a contar parênteses para não confundir os campos aninhados
 * de um `z.object({ lat, lon })` com campos da própria coleção.
 */
function camposDe(corpoComComentarios) {
  // Os comentários são retirados primeiro: trazem vírgulas, e a separação dos
  // campos é feita por vírgulas ao nível zero.
  const corpo = corpoComComentarios
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
  const campos = new Map();
  let nivel = 0;
  let inicioCampo = 0;
  const pedacos = [];
  for (let i = 0; i < corpo.length; i++) {
    const c = corpo[i];
    if (c === '{' || c === '(' || c === '[') nivel++;
    else if (c === '}' || c === ')' || c === ']') nivel--;
    else if (c === ',' && nivel === 0) {
      pedacos.push(corpo.slice(inicioCampo, i));
      inicioCampo = i + 1;
    }
  }
  pedacos.push(corpo.slice(inicioCampo));

  for (const pedaco of pedacos) {
    const m = pedaco.match(/^\s*(?:\/\*\*[\s\S]*?\*\/\s*)?(\w+):\s*([\s\S]+)$/);
    if (!m) continue;
    const [, nome, def] = m;
    if (campos.has(nome)) continue;
    campos.set(nome, {
      obrigatorio: !/\.optional\(\)|\.default\(/.test(def),
      valores: def.trim() === 'estadoOperacional' ? ESTADO_OPERACIONAL : valoresEnum(def),
    });
  }
  return campos;
}

/** Campos do esquema Zod de uma coleção de `src/content.config.ts`. */
function esquemaDe(nome) {
  const i = fonte.indexOf(`const ${nome} = defineCollection(`);
  if (i === -1) return null;
  const bloco = equilibrado(fonte, i, '(', ')');
  if (!bloco) return null;

  const j = bloco.indexOf('schema: z.object(');
  if (j === -1) return null;
  const argumento = bloco.slice(j + 'schema: z.object('.length).trimStart();

  // `z.object(baseArtigo)` ou `z.object({ …, ...baseArtigo })`.
  const corpo = argumento.startsWith('{')
    ? equilibrado(argumento, 0, '{', '}')
    : BASE_ARTIGO;
  if (corpo === null) return null;

  const campos = camposDe(corpo);
  if (corpo.includes('...baseArtigo')) {
    for (const [k, v] of camposDe(BASE_ARTIGO)) if (!campos.has(k)) campos.set(k, v);
  }
  return campos;
}

/* ----------------------------------------------------- Campos do CMS ------ */

/** Achata os campos de uma coleção Decap: nome → { obrigatorio, valores }. */
function camposCms(campos, prefixo = '') {
  const saida = new Map();
  for (const c of campos ?? []) {
    const nome = prefixo ? `${prefixo}.${c.name}` : c.name;
    const obrigatorio = c.required !== false;
    const valores = c.widget === 'select' ? opcoesDe(c) : null;
    saida.set(nome, { obrigatorio, valores, widget: c.widget, multiple: !!c.multiple });
    if (c.fields) for (const [k, v] of camposCms(c.fields, nome)) saida.set(k, v);
  }
  return saida;
}

const opcoesDe = (c) =>
  (c.options ?? []).map((o) => (typeof o === 'object' ? o.value : o));

/* ------------------------------------------------------- Comparação ------- */

/** Coleções de pastas do CMS ↔ coleções de conteúdo do Astro. */
const PASTAS = { noticias: 'noticias', tecnica: 'tecnica', eventos: 'eventos', paginas: 'paginas' };
/** Ficheiros JSON do CMS ↔ coleções de conteúdo, pelo campo de lista que editam. */
const FICHEIROS = {
  repetidores: { colecao: 'repetidores', lista: 'repetidores' },
  balizas: { colecao: 'balizas', lista: 'balizas' },
  documentos: { colecao: 'documentos', lista: 'documentos' },
  ligacoes: { colecao: 'ligacoes', lista: 'ligacoes' },
  faq: { colecao: 'faq', lista: 'faq' },
};
/** Campos que o CMS gere sozinho e que não existem no esquema. */
const SO_DO_CMS = new Set(['body']);

let comparadas = 0;

function comparar(rotulo, colecao, campos) {
  const esquema = esquemaDe(colecao);
  if (!esquema) {
    erro('coleção', `${rotulo}: não há coleção "${colecao}" em src/content.config.ts`);
    return;
  }
  comparadas++;

  for (const [nome, e] of esquema) {
    const c = campos.get(nome);
    if (!c) {
      if (e.obrigatorio) erro('campo em falta', `${rotulo}: o esquema exige "${nome}" e o CMS não o oferece`);
      else aviso('campo em falta', `${rotulo}: o esquema aceita "${nome}" e o CMS não o oferece`);
      continue;
    }
    if (e.obrigatorio && !c.obrigatorio) {
      erro(
        'obrigatoriedade',
        `${rotulo}.${nome}: obrigatório no esquema, opcional no CMS — o build falha se ficar vazio`,
      );
    }
    if (e.valores && c.valores) {
      for (const v of c.valores) {
        if (!e.valores.includes(v)) {
          erro(
            'valor fora do enum',
            `${rotulo}.${nome}: o CMS oferece "${v}", que o esquema recusa (aceita ${e.valores.join(', ')})`,
          );
        }
      }
    } else if (e.valores && !c.valores && c.widget === 'string') {
      aviso(
        'sem lista',
        `${rotulo}.${nome}: o esquema só aceita ${e.valores.join(', ')}, mas o CMS deixa escrever texto livre`,
      );
    }
  }

  for (const [nome, c] of campos) {
    if (SO_DO_CMS.has(nome) || nome.includes('.')) continue;
    if (!esquema.has(nome)) {
      erro(
        'campo desconhecido',
        `${rotulo}.${nome}: o CMS grava este campo e o esquema não o conhece` +
          (c.obrigatorio ? ' (e é obrigatório no CMS)' : ''),
      );
    }
  }
}

for (const col of cms.collections ?? []) {
  if (col.folder) {
    const colecao = PASTAS[col.name];
    if (!colecao) {
      erro('coleção', `coleção "${col.name}" do CMS sem correspondência conhecida neste guião`);
      continue;
    }
    comparar(col.name, colecao, camposCms(col.fields));
    continue;
  }

  for (const f of col.files ?? []) {
    const alvo = FICHEIROS[f.name];
    if (!alvo) continue; // JSON fora das coleções: validado por validar-dados.mjs
    const lista = (f.fields ?? []).find((c) => c.name === alvo.lista && c.widget === 'list');
    if (!lista) {
      erro('coleção', `${col.name}/${f.name}: não encontrei a lista "${alvo.lista}" no CMS`);
      continue;
    }
    comparar(`${col.name}/${f.name}`, alvo.colecao, camposCms(lista.fields));
  }
}

/* ---------------------------------------- Branch publicada (DOC-020) ------ */

/**
 * O Decap grava na branch indicada em `backend.branch`. Se ela não existir, as
 * gravações falham em produção — sem erro visível no repositório, porque o CMS
 * nem sequer chega a estar operacional.
 *
 * Fica em AVISO, e não em erro: qual deve ser a branch publicada é uma decisão
 * da associação, e não se corrige a partir do código. Ver DOC-020 em
 * docs/remediacao-da-auditoria.md.
 */
const branchCms = cms.backend?.branch;
if (!branchCms) {
  erro('branch', 'backend.branch não está definida em public/admin/config.yml');
} else {
  const existe = async (ref) =>
    correr('git', ['show-ref', '--verify', '--quiet', ref]).then(() => true, () => false);
  const local = await existe(`refs/heads/${branchCms}`);
  const remota = await existe(`refs/remotes/origin/${branchCms}`);
  if (!local && !remota) {
    aviso(
      'branch',
      `POR DECIDIR: o CMS grava na branch "${branchCms}", que não existe neste ` +
        'repositório. Enquanto assim for, o /admin/ não pode publicar em produção ' +
        '(DOC-020 — decisão da direção da associação).',
    );
  }
}

/* -------------------------------------- Coerência geral da configuração --- */

if (cms.media_folder !== 'public/imagens/conteudo') {
  erro('media', `media_folder é "${cms.media_folder}", esperado public/imagens/conteudo`);
}
if (cms.public_folder !== '/imagens/conteudo') {
  erro('media', `public_folder é "${cms.public_folder}", esperado /imagens/conteudo`);
}

for (const col of cms.collections ?? []) {
  for (const f of col.files ?? []) {
    if (f.file && !f.file.startsWith('src/')) {
      erro('caminho', `${col.name}/${f.name}: file "${f.file}" está fora de src/`);
    }
  }
  if (col.folder && !col.folder.startsWith('src/content/')) {
    erro('caminho', `${col.name}: folder "${col.folder}" está fora de src/content/`);
  }
}

/* --------------------------------------------------------------- Resumo --- */

console.log('══ CMS ↔ ESQUEMAS DE CONTEÚDO ══');
console.log(`Coleções comparadas: ${comparadas}`);
console.log('');

if (avisos.length) {
  console.log(`⚠ ${avisos.length} avisos:`);
  for (const a of avisos) console.log(`  [${a.c}] ${a.m}`);
  console.log('');
}

if (problemas.length === 0) {
  console.log('✓ O CMS não deixa gravar nada que o build venha a recusar.');
  process.exit(0);
}

console.log(`✗ ${problemas.length} problemas:`);
for (const p of problemas) console.log(`  [${p.c}] ${p.m}`);
process.exit(1);
