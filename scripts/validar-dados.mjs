/**
 * Validação por esquema dos ficheiros JSON lidos diretamente (DT-009).
 *
 * Cinco ficheiros de `src/data/` são importados pelas páginas sem passarem
 * pelas coleções de conteúdo do Astro e, por isso, sem validação nenhuma:
 *
 *     sitio · orgaos-sociais · direcao-tecnica · associados · cronologia
 *
 * Sem isto, `codigoPostal` escrito `codigopostal` não dá erro: dá `undefined`
 * no sítio publicado. Os esquemas abaixo são `strict()` de propósito — um
 * campo a mais é quase sempre um campo mal escrito.
 *
 * Os ficheiros continuam onde estão e a ser importados como são: só passam a
 * ser verificados. Este guião corre antes de `astro build`, pelo que um erro
 * aqui impede a publicação.
 *
 * Uso: node scripts/validar-dados.mjs
 */
import { readFile } from 'node:fs/promises';
import { z } from 'zod';

const texto = (msg) => z.string({ required_error: msg, invalid_type_error: msg }).min(1, msg);
const QUADRICULA = /^[A-Ra-r]{2}[0-9]{2}([A-Xa-x]{2})?$/;

/* ------------------------------------------------------------- Esquemas --- */

const coordenadas = z
  .object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  })
  .strict();

const sitio = z
  .object({
    nome: texto('nome curto da associação'),
    nomeCompleto: texto('nome completo da associação'),
    sigla: texto('sigla'),
    indicativo: texto('indicativo coletivo'),
    descricaoCurta: texto('descrição curta'),
    descricao: texto('descrição'),
    fundacao: texto('data de fundação'),
    morada: z
      .object({
        linha1: texto('primeira linha da morada'),
        linha2: z.string().optional(),
        codigoPostal: z.string().regex(/^\d{4}-\d{3}$/, 'código postal no formato 0000-000'),
        localidade: texto('localidade'),
        pais: texto('país'),
      })
      .strict(),
    coordenadas,
    coordenadasTexto: texto('coordenadas por extenso'),
    quadricula: z.string().regex(QUADRICULA, 'quadrícula Maidenhead válida (ex.: IM58pa)'),
    mapaExterno: z.string().url('endereço completo para o mapa externo'),
    email: z
      .object({
        utilizador: texto('parte do email antes do @'),
        dominio: texto('parte do email depois do @'),
      })
      .strict(),
    quotaAnual: texto('valor da quota anual'),
    iban: z.string().regex(/^PT50 ?[\d ]{21,29}$/, 'IBAN português (PT50 …)'),
    nib: z.string().regex(/^[\d .]+$/, 'NIB só com dígitos e separadores'),
    titularConta: texto('titular da conta'),
    redes: z
      .array(
        z
          .object({
            nome: texto('nome da rede social'),
            url: z.string().url('endereço completo da rede social'),
            icone: z.enum(['facebook', 'externo', 'partilhar']),
          })
          .strict(),
      )
      .default([]),
    areaGeografica: z.array(texto('nome do concelho')).min(1),
  })
  .strict();

const orgaosSociais = z
  .object({
    mandato: texto('mandato'),
    notaMandato: texto('nota sobre o mandato'),
    orgaos: z
      .array(
        z
          .object({
            nome: texto('nome do órgão'),
            membros: z
              .array(
                z
                  .object({
                    cargo: texto('cargo'),
                    nome: texto('nome do membro'),
                    indicativo: z.string().optional(),
                    numeroAssociado: z.number().int().positive(),
                  })
                  .strict(),
              )
              .min(1, 'pelo menos um membro'),
          })
          .strict(),
      )
      .min(1, 'pelo menos um órgão'),
  })
  .strict();

const direcaoTecnica = z
  .object({
    areas: z
      .array(
        z
          .object({
            nome: texto('nome da área'),
            // Tem de coincidir com as opções em public/admin/config.yml e com
            // os nomes conhecidos por src/components/Icone.astro.
            icone: z.enum(['antena', 'rede', 'energia', 'codigo', 'ferramenta', 'onda']),
            responsaveis: z
              .array(
                z
                  .object({
                    nome: texto('nome do responsável'),
                    indicativo: z.string().optional(),
                  })
                  .strict(),
              )
              .min(1, 'pelo menos um responsável'),
          })
          .strict(),
      )
      .min(1, 'pelo menos uma área'),
  })
  .strict();

const associados = z
  .object({
    nota: texto('nota apresentada na página'),
    associados: z
      .array(
        z
          .object({
            numero: z.number().int().positive(),
            indicativo: z.string().optional(),
            nome: texto('nome do associado'),
          })
          .strict(),
      )
      .min(1, 'pelo menos um associado'),
  })
  .strict();

const cronologia = z
  .object({
    introducao: texto('introdução'),
    nota: texto('nota metodológica'),
    emAtualizacao: z.boolean(),
    entradas: z
      .array(
        z
          .object({
            // Entradas herdadas do documento original podem não ter data: o
            // sítio mostra-as a seguir ao acontecimento anterior.
            data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
            dataTexto: z.string().nullable(),
            ordenacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'data de ordenação AAAA-MM-DD'),
            texto: texto('texto do acontecimento'),
          })
          .strict(),
      )
      .min(1, 'pelo menos uma entrada'),
  })
  .strict();

const FICHEIROS = [
  ['src/data/sitio.json', sitio],
  ['src/data/orgaos-sociais.json', orgaosSociais],
  ['src/data/direcao-tecnica.json', direcaoTecnica],
  ['src/data/associados.json', associados],
  ['src/data/cronologia.json', cronologia],
];

/* ------------------------------------------------------------- Validação -- */

const problemas = [];
const avisos = [];
const dados = {};

for (const [caminho, esquema] of FICHEIROS) {
  let bruto;
  try {
    bruto = JSON.parse(await readFile(caminho, 'utf8'));
  } catch (e) {
    problemas.push(`${caminho}: JSON inválido — ${e.message}`);
    continue;
  }
  const r = esquema.safeParse(bruto);
  if (r.success) {
    dados[caminho] = r.data;
    continue;
  }
  for (const i of r.error.issues) {
    const onde = i.path.length ? i.path.join('.') : '(raiz)';
    problemas.push(`${caminho} → ${onde}: ${i.message}`);
  }
}

/* -------------------------------------------- Coerência entre ficheiros --- */

const listaAssociados = dados['src/data/associados.json'];
const orgaos = dados['src/data/orgaos-sociais.json'];
if (listaAssociados && orgaos) {
  const numeros = new Set(listaAssociados.associados.map((a) => a.numero));
  for (const orgao of orgaos.orgaos) {
    for (const m of orgao.membros) {
      if (!numeros.has(m.numeroAssociado)) {
        // Aviso, não erro: a lista pública de associados pode, legitimamente,
        // não incluir toda a gente. Confirmar com a direção — ver
        // docs/carece-de-verificacao.md.
        avisos.push(
          `orgaos-sociais: ${orgao.nome} — ${m.nome} tem o nº ${m.numeroAssociado}, ` +
            `que não consta da lista pública de associados`,
        );
      }
    }
  }
}

const cronologiaLida = dados['src/data/cronologia.json'];
if (cronologiaLida) {
  for (const [i, e] of cronologiaLida.entradas.entries()) {
    if (e.data && e.ordenacao && e.data !== e.ordenacao) {
      avisos.push(
        `cronologia: entrada ${i + 1} tem data ${e.data} e ordenação ${e.ordenacao}`,
      );
    }
  }
}

/* --------------------------------------------------------------- Resumo --- */

console.log('══ DADOS JSON FORA DAS COLEÇÕES ══');
console.log(`Ficheiros validados: ${FICHEIROS.length}`);
console.log('');

if (avisos.length) {
  console.log(`⚠ ${avisos.length} avisos:`);
  for (const a of avisos) console.log(`  ${a}`);
  console.log('');
}

if (problemas.length === 0) {
  console.log('✓ Todos os campos existem e têm o tipo esperado.');
  process.exit(0);
}

console.log(`✗ ${problemas.length} problemas:`);
for (const p of problemas) console.log(`  ${p}`);
console.log('\nUm campo «não reconhecido» é quase sempre um nome mal escrito.');
process.exit(1);
