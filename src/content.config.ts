import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * Os ficheiros de dados guardam a lista dentro de uma chave (ex.: { repetidores: [...] })
 * porque o Decap CMS não consegue editar um JSON cuja raiz seja um array.
 * Este parser desembrulha-a para o carregador do Astro.
 */
const listaEm = (chave: string) => (texto: string) => {
  const dados = JSON.parse(texto);
  return Array.isArray(dados) ? dados : (dados[chave] ?? []);
};

/* --------------------------------------------------------------------------
 * Esquemas de conteúdo da ARLA.
 *
 * Tudo o que é facto (frequências, nomes, datas, valores) vive em ficheiros
 * Markdown ou JSON editáveis pela direção — nada está escrito no código.
 * -------------------------------------------------------------------------- */

const estadoOperacional = z.enum(['operacional', 'manutencao', 'indisponivel', 'desconhecido']);

/** Campos comuns a qualquer conteúdo editorial. */
const baseArtigo = {
  titulo: z.string(),
  resumo: z.string(),
  data: z.coerce.date(),
  atualizado: z.coerce.date().optional(),
  autor: z.string().optional(),
  indicativo: z.string().optional(),
  imagem: z.string().optional(),
  imagemAlt: z.string().optional(),
  categoria: z.string().default('Geral'),
  etiquetas: z.array(z.string()).default([]),
  /** Conteúdo histórico: mostra aviso de contexto temporal. */
  historico: z.boolean().default(false),
  /** Nota de contexto mostrada no aviso (ex.: legislação entretanto alterada). */
  notaHistorica: z.string().optional(),
  /** URL na versão WordPress do sítio, preservado para o mapa de redireções. */
  urlAntigo: z.string().optional(),
  destaque: z.boolean().default(false),
  rascunho: z.boolean().default(false),
  anexos: z
    .array(z.object({ nome: z.string(), ficheiro: z.string(), tipo: z.string().optional() }))
    .default([]),
};

const noticias = defineCollection({
  loader: glob({ base: './src/content/noticias', pattern: '**/*.md' }),
  schema: z.object(baseArtigo),
});

const tecnica = defineCollection({
  loader: glob({ base: './src/content/tecnica', pattern: '**/*.md' }),
  schema: z.object({
    ...baseArtigo,
    /** Mostrar índice de conteúdos em artigos longos. */
    indice: z.boolean().default(true),
    nivel: z.enum(['introducao', 'intermedio', 'avancado']).default('intermedio'),
    referencias: z.array(z.object({ titulo: z.string(), url: z.string() })).default([]),
  }),
});

const eventos = defineCollection({
  loader: glob({ base: './src/content/eventos', pattern: '**/*.md' }),
  schema: z.object({
    ...baseArtigo,
    inicio: z.coerce.date(),
    fim: z.coerce.date().optional(),
    /** Texto livre que substitui a data formatada, quando esta é aproximada. */
    dataTexto: z.string().optional(),
    horaInicio: z.string().optional(),
    horaFim: z.string().optional(),
    local: z.string().optional(),
    coordenadas: z.object({ lat: z.number(), lon: z.number() }).optional(),
    organizador: z.string().optional(),
    inscricoes: z.string().optional(),
    ligacaoExterna: z.string().optional(),
    tipo: z.enum(['atividade', 'workshop', 'concurso', 'encontro', 'divulgacao']).default('atividade'),
    cancelado: z.boolean().default(false),
  }),
});

/** Páginas institucionais editáveis em Markdown (história, o que é o radioamadorismo…). */
const paginas = defineCollection({
  loader: glob({ base: './src/content/paginas', pattern: '**/*.md' }),
  schema: z.object({
    titulo: z.string(),
    resumo: z.string(),
    atualizado: z.coerce.date().optional(),
    autor: z.string().optional(),
    indicativo: z.string().optional(),
    indice: z.boolean().default(false),
    urlAntigo: z.string().optional(),
  }),
});

/* ---------------------------- Dados estruturados --------------------------- */

const repetidores = defineCollection({
  loader: file('./src/data/repetidores.json', { parser: listaEm('repetidores') }),
  schema: z.object({
    id: z.string(),
    canal: z.string().optional(),
    banda: z.enum(['VHF', 'UHF', 'SHF', 'HF']),
    modo: z.string(),
    /** Chaves normalizadas para filtragem: analogico, dmr, dstar, aprs… */
    filtros: z.array(z.string()).default([]),
    localizacao: z.string(),
    quadricula: z.string().optional(),
    coordenadas: z.object({ lat: z.number(), lon: z.number() }).optional(),
    frequenciaTx: z.string(),
    frequenciaRx: z.string(),
    tom: z.string().optional(),
    acesso: z.string().optional(),
    potencia: z.string().optional(),
    indicativo: z.string(),
    estado: estadoOperacional,
    notas: z.string().optional(),
  }),
});

const balizas = defineCollection({
  loader: file('./src/data/balizas.json', { parser: listaEm('balizas') }),
  schema: z.object({
    id: z.string(),
    banda: z.string(),
    localizacao: z.string(),
    quadricula: z.string().optional(),
    coordenadas: z.object({ lat: z.number(), lon: z.number() }).optional(),
    frequencia: z.string(),
    modo: z.string(),
    potencia: z.string().optional(),
    indicativo: z.string(),
    antena: z.string().optional(),
    estado: estadoOperacional,
    notas: z.string().optional(),
  }),
});

const documentos = defineCollection({
  loader: file('./src/data/documentos.json', { parser: listaEm('documentos') }),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    descricao: z.string().optional(),
    categoria: z.string(),
    ficheiro: z.string(),
    tipo: z.string().default('PDF'),
    tamanho: z.string().optional(),
    data: z.coerce.date().optional(),
    externo: z.boolean().default(false),
  }),
});

const ligacoes = defineCollection({
  loader: file('./src/data/ligacoes.json', { parser: listaEm('ligacoes') }),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    url: z.string(),
    descricao: z.string().optional(),
    categoria: z.string(),
  }),
});

const faq = defineCollection({
  loader: file('./src/data/faq.json', { parser: listaEm('faq') }),
  schema: z.object({
    id: z.string(),
    pergunta: z.string(),
    resposta: z.string(),
    categoria: z.string().default('Geral'),
  }),
});

export const collections = {
  noticias,
  tecnica,
  eventos,
  paginas,
  repetidores,
  balizas,
  documentos,
  ligacoes,
  faq,
};
