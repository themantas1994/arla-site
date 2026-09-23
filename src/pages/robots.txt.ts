import type { APIContext } from 'astro';

/**
 * robots.txt gerado no build (DOC-017).
 *
 * Antes era um ficheiro estático em `public/`, com o endereço do sitemap
 * escrito literalmente: em qualquer domínio que não fosse o de produção — uma
 * pré-visualização, um domínio novo — apontava para o sítio errado. Agora
 * segue `Astro.site`, ou seja, `PUBLIC_SITE_URL`.
 */

/** Áreas que não devem ser indexadas. Tem de coincidir com o filtro do sitemap. */
const BLOQUEADAS = ['/area-reservada/', '/admin/'];

export async function GET({ site }: APIContext) {
  if (!site) throw new Error('astro.config.mjs tem de definir "site" para gerar o robots.txt');

  const corpo = [
    'User-agent: *',
    'Allow: /',
    ...BLOQUEADAS.map((r) => `Disallow: ${r}`),
    '',
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
    '',
  ].join('\n');

  return new Response(corpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
