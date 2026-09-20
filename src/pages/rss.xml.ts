import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { noticias, tecnica, eventos } from '@lib/conteudo';
import { SITIO } from '@lib/sitio';

export async function GET(context: APIContext) {
  const itens = [
    ...(await noticias()).map((n) => ({
      title: n.data.titulo,
      description: n.data.resumo,
      pubDate: n.data.data,
      link: `/noticias/${n.id}/`,
      categories: [n.data.categoria, ...n.data.etiquetas],
    })),
    ...(await tecnica()).map((a) => ({
      title: a.data.titulo,
      description: a.data.resumo,
      pubDate: a.data.data,
      link: `/tecnica/${a.id}/`,
      categories: ['Artigo técnico', a.data.categoria, ...a.data.etiquetas],
    })),
    ...(await eventos()).map((e) => ({
      title: e.data.titulo,
      description: e.data.resumo,
      pubDate: e.data.data,
      link: `/eventos/${e.id}/`,
      categories: ['Evento', e.data.categoria, ...e.data.etiquetas],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: `ARLA — ${SITIO.nomeCompleto}`,
    description: SITIO.descricaoCurta,
    site: context.site!,
    items: itens,
    customData: [
      '<language>pt-PT</language>',
      `<copyright>© ${new Date().getFullYear()} ${SITIO.nomeCompleto}</copyright>`,
    ].join(''),
  });
}
