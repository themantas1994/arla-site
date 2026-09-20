# SEO

## Metadata

Every page renders `<title>`, meta description, canonical URL, Open Graph, and Twitter Card tags through `Base.astro`, driven by props passed down from the page/layout (typically `titulo` and `descricao`, sometimes `imagem` for social cards). To set metadata for a new page, pass these props to `Pagina.astro`/`Artigo.astro` (which forward to `Base.astro`) rather than writing `<head>` tags directly.

`semIndexacao` is a prop recognized by the page layouts (used on `/pesquisa/` and `/area-reservada/`) that adds `noindex` and excludes the page from the sitemap.

## Canonical URLs

The canonical origin is `PUBLIC_SITE_URL` (env var, defaults to `https://www.cs5arla.pt` — set in `astro.config.mjs`'s `site` value and read via `Astro.site` throughout the codebase, e.g. `new URL(Astro.url.pathname, Astro.site).href`). Every page computes its own canonical URL from `Astro.site` and its own path — there's no manual canonical-URL field to fill in per page.

## Structured data (JSON-LD)

Emitted per page type, matching what's actually on the page:

| Type | Where |
| --- | --- |
| `Organization` | Every page (in `Base.astro`) |
| `NewsArticle` | News article detail pages |
| `TechArticle` | Technical article detail pages |
| `Event` | Event detail pages |
| `FAQPage` | `/recursos/faq/` |
| `HowTo` | The "getting started" guide (`/radioamadorismo/comecar/`) |
| `BreadcrumbList` | Every page with a breadcrumb trail (`MigalhasPao.astro`) |
| `WebSite` (with `SearchAction`) | Homepage only, pointing `SearchAction.target` at `/pesquisa/?q={search_term_string}` |

To add structured data to a new page type, build the JSON-LD object in the page's frontmatter (see `src/pages/index.astro` for the `WebSite`/`SearchAction` example) and pass it as a `jsonLd` prop to `Base.astro`, which serializes it into a `<script type="application/ld+json">` tag.

## Sitemap

`@astrojs/sitemap` (configured in `astro.config.mjs`) generates `sitemap-index.xml` at build time, with `i18n: { defaultLocale: 'pt', locales: { pt: 'pt-PT' } }` and a `filter` that excludes any page under `/area-reservada/`. At the time of the last recorded audit (`docs/qualidade.md`), 109 URLs were in the sitemap out of 112 analyzed pages (the 3 excluded are `noindex` utility pages).

## Robots

`public/robots.txt` allows all crawling except `/admin/` (the CMS) and `/area-reservada/` (the members-area placeholder), and points to the sitemap.

## Redirects

189 permanent redirects from the legacy WordPress URL structure, defined once in `src/lib/redirects.mjs` and expressed for three deployment targets — see [Deployment](Deployment#redirects).

## Breadcrumbs

`MigalhasPao.astro` renders the visible breadcrumb trail and emits matching `BreadcrumbList` JSON-LD; pages pass a `migalhas` prop (array of `{ rotulo, href? }`) to their layout to define the trail.

## RSS

`/rss.xml` (`src/pages/rss.xml.ts`, via `@astrojs/rss`) combines news, technical articles, and events into a single feed, sorted by date.

## Adding SEO to a new page

1. Pass `titulo` and `descricao` to the layout (`Pagina.astro` or `Artigo.astro`) — these become the `<title>`, meta description, and OG/Twitter tags automatically.
2. Pass `migalhas` for a breadcrumb trail (and matching `BreadcrumbList` JSON-LD).
3. If the page represents a schema.org type not already covered, build the JSON-LD object yourself and pass it as `jsonLd` — follow an existing page (e.g. `noticias/[...slug].astro` for `NewsArticle`) as a template rather than starting from scratch.
4. If the page shouldn't be indexed (an admin/utility page), pass `semIndexacao`.

See [`docs/qualidade.md`](https://github.com/themantas1994/arla/blob/main/docs/qualidade.md#seo) for the last recorded SEO audit results (0 blocking issues at time of writing; a handful of event titles exceed the ~65-character recommendation because they reproduce long official event names verbatim — a deliberate choice, not an oversight).
