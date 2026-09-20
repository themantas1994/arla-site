import { getCollection, type CollectionEntry } from 'astro:content';
import { estadoEvento, normalizar } from './sitio';

const publicado = <T extends { data: { rascunho?: boolean } }>(e: T) =>
  import.meta.env.DEV || !e.data.rascunho;

/** Notícias por data decrescente. */
export async function noticias(): Promise<CollectionEntry<'noticias'>[]> {
  const todas = await getCollection('noticias', publicado);
  return todas.sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
}

/** Artigos técnicos por data decrescente. */
export async function tecnica(): Promise<CollectionEntry<'tecnica'>[]> {
  const todos = await getCollection('tecnica', publicado);
  return todos.sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
}

/** Eventos por data de início decrescente. */
export async function eventos(): Promise<CollectionEntry<'eventos'>[]> {
  const todos = await getCollection('eventos', publicado);
  return todos.sort((a, b) => b.data.inicio.getTime() - a.data.inicio.getTime());
}

/** Eventos ainda por acontecer ou a decorrer, do mais próximo para o mais distante. */
export async function eventosFuturos(): Promise<CollectionEntry<'eventos'>[]> {
  const todos = await eventos();
  return todos
    .filter((e) => estadoEvento(e.data.inicio, e.data.fim) !== 'terminado')
    .sort((a, b) => a.data.inicio.getTime() - b.data.inicio.getTime());
}

export async function eventosPassados(): Promise<CollectionEntry<'eventos'>[]> {
  const todos = await eventos();
  return todos.filter((e) => estadoEvento(e.data.inicio, e.data.fim) === 'terminado');
}

/** Slug de uma categoria, para usar em URLs: «Fim de Semana AM» → «fim-de-semana-am». */
export function slugCategoria(c: string): string {
  return normalizar(c).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Escolhe conteúdos relacionados: primeiro os que partilham etiquetas,
 * depois os da mesma categoria, sempre excluindo o próprio artigo.
 */
export function relacionados<
  T extends { id: string; data: { etiquetas: string[]; categoria: string } },
>(atual: T, candidatos: T[], quantos = 3): T[] {
  const etiquetas = new Set(atual.data.etiquetas.map(normalizar));
  const pontuado = candidatos
    .filter((c) => c.id !== atual.id)
    .map((c) => {
      const comuns = c.data.etiquetas.filter((t) => etiquetas.has(normalizar(t))).length;
      const mesmaCategoria = normalizar(c.data.categoria) === normalizar(atual.data.categoria) ? 1 : 0;
      return { c, pontos: comuns * 2 + mesmaCategoria };
    })
    .filter((p) => p.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos);

  const escolhidos = pontuado.slice(0, quantos).map((p) => p.c);
  // Completa com os mais recentes, se faltarem.
  if (escolhidos.length < quantos) {
    for (const c of candidatos) {
      if (escolhidos.length >= quantos) break;
      if (c.id === atual.id || escolhidos.includes(c)) continue;
      escolhidos.push(c);
    }
  }
  return escolhidos;
}

/** Texto simples do corpo Markdown, para contar palavras e gerar excertos. */
export function textoSimples(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
