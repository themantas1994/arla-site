# Routing

File-based routing under `src/pages/` (41 route files). `trailingSlash: 'always'` and `build: { format: 'directory' }` in `astro.config.mjs` mean every route serves as `.../index.html` and every URL ends in `/`.

| Route | Purpose | Source | Notes |
| --- | --- | --- | --- |
| `/` | Homepage: hero, latest news, technical articles, upcoming/recent events, repeater/beacon snapshot | `src/pages/index.astro` | Static |
| `/arla/` | About ARLA: purpose, scope | `src/pages/arla/index.astro` | Static |
| `/arla/historia/` | History timeline | `src/pages/arla/historia.astro` | Reads `cronologia.json` |
| `/arla/quem-somos/` | Public member list | `src/pages/arla/quem-somos.astro` | Reads `associados.json` |
| `/arla/orgaos-sociais/` | Governing bodies (assembly board, board of directors, supervisory board) | `src/pages/arla/orgaos-sociais.astro` | Reads `orgaos-sociais.json` |
| `/arla/direcao-tecnica/` | Technical direction team, by area | `src/pages/arla/direcao-tecnica.astro` | Reads `direcao-tecnica.json` |
| `/arla/ser-associado/` | How to become a member | `src/pages/arla/ser-associado.astro` | Static |
| `/arla/quotizacao/` | Membership fee and payment info | `src/pages/arla/quotizacao.astro` | Reads `sitio.json` (fee, IBAN) |
| `/radioamadorismo/` | Amateur radio section index | `src/pages/radioamadorismo/index.astro` | Static |
| `/radioamadorismo/comecar/` | "Getting started" beginner's guide | `src/pages/radioamadorismo/comecar.astro` | Static |
| `/radioamadorismo/o-que-e/` | What is amateur radio | `src/pages/radioamadorismo/[pagina].astro` (`pagina=o-que-e`) | Dynamic route rendering the `paginas` collection entry `o-que-e-o-radioamadorismo` |
| `/radioamadorismo/ser-radioamador/` | The different ways to practice amateur radio | `src/pages/radioamadorismo/[pagina].astro` (`pagina=ser-radioamador`) | Dynamic route rendering the `paginas` collection entry `ser-radioamador` |
| `/radioamadorismo/satelites/` | Satellite communications, QO-100 | `src/pages/radioamadorismo/satelites.astro` | Static |
| `/radioamadorismo/meteorologia-espacial/` | Space weather / propagation | `src/pages/radioamadorismo/meteorologia-espacial.astro` | Embeds HamQSL/NOAA panel images, lazy-loaded |
| `/tecnica/` | Technical articles index | `src/pages/tecnica/index.astro` | Lists `tecnica` collection |
| `/tecnica/[slug]/` | Technical article detail | `src/pages/tecnica/[...slug].astro` | `getStaticPaths()` over `tecnica` collection; slug = filename |
| `/rede/` | Network section index | `src/pages/rede/index.astro` | Static |
| `/rede/repetidores/` | Repeater directory, table + filters | `src/pages/rede/repetidores.astro` | Renders `TabelaRepetidores` with the `repetidores` collection |
| `/rede/balizas/` | Beacon directory | `src/pages/rede/balizas.astro` | Reads `balizas` collection |
| `/rede/aprs/` | APRS digipeaters | `src/pages/rede/aprs.astro` | Static, references specific `repetidores` entries |
| `/rede/cs5arla/` | The collective-use station | `src/pages/rede/cs5arla.astro` | Static |
| `/rede/mapa/` | Network map | `src/pages/rede/mapa.astro` | Renders `Mapa.astro` with all repeaters/beacons/HQ |
| `/noticias/` | News index | `src/pages/noticias/index.astro` | Lists `noticias` collection |
| `/noticias/[slug]/` | News article detail | `src/pages/noticias/[...slug].astro` | `getStaticPaths()` over `noticias`; slug = filename |
| `/noticias/categoria/[categoria]/` | News filtered by category | `src/pages/noticias/categoria/[categoria].astro` | One page per distinct `categoria`, via `slugCategoria()` |
| `/noticias/pagina/[pagina]/` | Paginated news index | `src/pages/noticias/pagina/[pagina].astro` | Numbered pagination |
| `/eventos/` | Events index (upcoming/past) | `src/pages/eventos/index.astro` | Uses `eventosFuturos()`/`eventosPassados()` |
| `/eventos/[slug]/` | Event detail | `src/pages/eventos/[...slug].astro` | `getStaticPaths()` over `eventos`; slug = filename |
| `/arquivo/` | Full content archive, filterable | `src/pages/arquivo.astro` | Combines noticias/tecnica/eventos by year |
| `/recursos/` | Resources section index | `src/pages/recursos/index.astro` | Static |
| `/recursos/documentos/` | Document library (PDFs) | `src/pages/recursos/documentos.astro` | Reads `documentos` collection |
| `/recursos/ligacoes/` | Curated external links | `src/pages/recursos/ligacoes.astro` | Reads `ligacoes` collection |
| `/recursos/faq/` | Frequently asked questions | `src/pages/recursos/faq.astro` | Reads `faq` collection; emits `FAQPage` JSON-LD |
| `/contactos/` | Contact info, map | `src/pages/contactos.astro` | Reads `sitio.json`; renders `Mapa.astro` with HQ location |
| `/pesquisa/` | Site search | `src/pages/pesquisa.astro` | Client-side, queries the Pagefind index; shows a "not available" message under `npm run dev` |
| `/legal/aviso-legal/` | Legal notice | `src/pages/legal/aviso-legal.astro` | Reads `paginas` collection entry `aviso-legal` |
| `/legal/privacidade/` | Privacy policy | `src/pages/legal/privacidade.astro` | Static |
| `/legal/cookies/` | Cookie policy | `src/pages/legal/cookies.astro` | Static |
| `/area-reservada/` | Members-only area placeholder | `src/pages/area-reservada.astro` | Explains that the old WordPress login/register system was not carried over; excluded from the sitemap and marked `noindex` |
| `/rss.xml` | RSS feed (news + articles + events) | `src/pages/rss.xml.ts` | Uses `@astrojs/rss` |
| `/404` | Not found page | `src/pages/404.astro` | Includes search box and shortcuts |
| `/500` | Server error page | `src/pages/500.astro` | Static (only meaningful on hosts that route 500s to it) |

## Redirects (not routes, but relevant)

189 legacy WordPress URLs (e.g. `/2019/07/07/comunicado-1-banda-dos-144-146-mhz-wrc23/`) redirect to their new equivalents, defined once in `src/lib/redirects.mjs` and expressed in three host-specific formats — see [Deployment](Deployment#redirects) and [`docs/mapa-de-redirecoes.md`](https://github.com/themantas1994/arla/blob/main/docs/mapa-de-redirecoes.md) for the complete map.

## Adding a new route

- **Static content page:** add a `.astro` file under `src/pages/` at the desired path; it becomes routable immediately.
- **Content-collection-backed listing/detail:** follow the `noticias`/`tecnica`/`eventos` pattern — an `index.astro` for the listing and a `[...slug].astro` with `getStaticPaths()` for the detail page, reading from `getCollection()`.
- **New navigation entry:** add it to `NAVEGACAO` in `src/lib/navegacao.ts` — this is the single source of truth for the header/mobile menu; a route existing under `src/pages/` does not automatically appear in navigation.
