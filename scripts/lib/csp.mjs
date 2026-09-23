/**
 * Content-Security-Policy do sítio da ARLA — fonte única.
 *
 * Usada por `scripts/auditar-csp.mjs`, que a aplica em modo de imposição num
 * navegador real e conta as violações, e copiada para `public/.htaccess`, onde
 * é servida em modo `Report-Only`.
 *
 * ESTADO: Report-Only. Não bloqueia nada — só permite ver o que bloquearia.
 * Ver docs/seguranca-csp.md antes de a passar a impositiva.
 *
 * As origens abaixo foram levantadas do build, não presumidas:
 *   tile.openstreetmap.org  telas dos mapas Leaflet (/rede/mapa/, /contactos/…)
 *   www.hamqsl.com          painéis de meteorologia espacial
 *   services.swpc.noaa.gov  imagem de síntese da meteorologia espacial (NOAA)
 *   unpkg.com               Decap CMS em /admin/ (versão fixa + SRI)
 *   api.github.com          o Decap grava no repositório por aqui
 */

export const DIRETIVAS = {
  'default-src': ["'self'"],

  // 'unsafe-inline': o Astro produz <script type="module"> em linha em várias
  // páginas, e o guião do tema TEM de correr antes da primeira pintura para não
  // haver salto de cor. Passar a hashes obriga a regerar a política a cada
  // build — ver docs/seguranca-csp.md.
  // 'wasm-unsafe-eval': a pesquisa (Pagefind) corre em WebAssembly.
  'script-src': ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'", 'https://unpkg.com'],

  // O Leaflet posiciona as telas por atributo style.
  'style-src': ["'self'", "'unsafe-inline'"],

  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://tile.openstreetmap.org',
    'https://www.hamqsl.com',
    'https://services.swpc.noaa.gov',
  ],
  'font-src': ["'self'"],
  'media-src': ["'self'"],

  // O Pagefind vai buscar o índice ao próprio sítio; o Decap fala com o GitHub.
  'connect-src': ["'self'", 'https://api.github.com', 'https://unpkg.com'],

  // O sítio não embebe nem é embebido; não há plug-ins nem applets.
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'frame-ancestors': ["'self'"],

  // O único destino de formulário é o OAuth do GitHub, a partir de /admin/.
  'form-action': ["'self'", 'https://github.com'],
  'base-uri': ["'self'"],
  'upgrade-insecure-requests': [],
};

/** A política numa linha, no formato do cabeçalho HTTP. */
export function politica() {
  return Object.entries(DIRETIVAS)
    .map(([d, v]) => (v.length ? `${d} ${v.join(' ')}` : d))
    .join('; ');
}
