# Project Structure

Full breakdown of the repository layout. For a shorter version, see the [README](https://github.com/themantas1994/arla/blob/main/README.md#project-structure).

```text
arla/
├── .nvmrc                    Node version used for development (22)
├── astro.config.mjs          Astro configuration (site URL, redirects, sitemap, image, markdown)
├── tsconfig.json             TypeScript config (extends astro/tsconfigs/strict), path aliases
├── package.json               Scripts and dependencies
├── package-lock.json
├── README.md
├── src/
│   ├── content.config.ts      Content Collection definitions + Zod schemas (see below)
│   ├── content/                Markdown content, one file per entry
│   │   ├── noticias/            39 news articles/announcements
│   │   ├── tecnica/              8 technical articles
│   │   ├── eventos/              17 events and activities
│   │   └── paginas/               4 long-form editorial pages
│   ├── data/                    JSON structured data, edited via the CMS
│   │   ├── sitio.json             Site-wide settings: address, contacts, IBAN, fee, socials
│   │   ├── repetidores.json       Repeater directory
│   │   ├── balizas.json           Beacon directory
│   │   ├── orgaos-sociais.json    Governing bodies (by mandate/term)
│   │   ├── direcao-tecnica.json   Technical direction team, by area
│   │   ├── associados.json        Public member list
│   │   ├── cronologia.json        Association history, entry by entry
│   │   ├── documentos.json        Document library metadata
│   │   ├── ligacoes.json          Curated external links
│   │   └── faq.json               Frequently asked questions
│   ├── components/               ~20 reusable .astro components — see Components
│   ├── layouts/
│   │   ├── Base.astro              HTML document shell: <head>, header, footer, theme script
│   │   ├── Pagina.astro            Long-form text page layout
│   │   └── Artigo.astro            News/technical-article/event detail layout
│   ├── pages/                     File-based routes — see Routing for the full table
│   ├── lib/
│   │   ├── conteudo.ts             Collection queries: noticias(), tecnica(), eventos(),
│   │   │                           eventosFuturos()/eventosPassados(), relacionados(), slugCategoria()
│   │   ├── sitio.ts                Site-wide helpers: email formatting, date formatting,
│   │   │                           estadoEvento() (event status logic), normalizar() (accent-strip)
│   │   ├── maidenhead.ts           Maidenhead (QTH locator) → lat/lon conversion for the map
│   │   ├── navegacao.ts            Single source of truth for the main navigation menu
│   │   └── redirects.mjs           189 legacy WordPress URL → new URL redirect map
│   └── styles/
│       └── global.css              The entire design system: tokens, layout, components (~500 lines)
├── public/
│   ├── admin/
│   │   ├── config.yml               Decap CMS collection/field definitions
│   │   └── index.html                Decap CMS entry point
│   ├── documentos/                  Association PDFs (statutes, regulations, membership form)
│   ├── imagens/
│   │   ├── conteudo/                  Migrated images/videos (also the CMS media upload folder)
│   │   ├── logotipo-arla*.png, icone-*.png, icone-arla.jpg
│   ├── .htaccess                    301 redirects + security headers (Apache)
│   ├── _redirects                   301 redirects (Netlify/Cloudflare Pages format)
│   ├── robots.txt
│   ├── manifest.webmanifest
│   ├── favicon.svg, favicon-32.png, apple-touch-icon.png
├── docs/                           Portuguese documentation for the association — see below
│   ├── arquitetura.md               Architecture rationale and decisions (source for the Wiki's
│   │                                 Architecture page)
│   ├── gestao-de-conteudos.md       Content-editing guide, for non-developer board members
│   ├── implantacao.md               Deployment guide (source for Deployment/CI-CD wiki pages)
│   ├── qualidade.md                 Recorded QA results: accessibility, performance, SEO, links
│   ├── inventario-de-conteudos.md   Content migration audit (page-by-page, from the old site)
│   ├── mapa-de-redirecoes.md        The 189-entry legacy URL → new URL redirect map, documented
│   └── carece-de-verificacao.md     Facts carried over from the old site that need human review
│                                     (e.g. possibly outdated board mandate, membership fee)
├── scripts/                        Node.js developer tooling (see Testing and Performance)
│   ├── qa.mjs                        Accessibility, responsive, functional tests (Playwright)
│   ├── capturas.mjs                  Responsive screenshot generation
│   ├── auditar-seo.mjs               Metadata/structured-data/sitemap audit
│   ├── auditar-desempenho.mjs        Core Web Vitals audit under throttled network
│   ├── check-links.mjs               Broken-link checker over the built dist/
│   └── otimizar-media.mjs            One-off image resize/re-encode for migrated media
└── (generated, git-ignored)
    ├── dist/                        Build output (npm run build)
    ├── .astro/                      Astro's internal cache/types
    └── reports/                     Output of the qa/audit scripts
```

## Why `docs/` and the Wiki are separate

`docs/` predates this Wiki and serves a different audience: it's written in **Portuguese**, for the association's board members who use `/admin/` to publish content and don't write code. It documents *why* decisions were made, records the original site migration audit, and tracks what still needs human confirmation (e.g. is the published membership fee still current?).

This Wiki is **English**, developer-facing, and focused on *how the code works* so a new contributor can get productive quickly. Where both cover the same ground (e.g. architecture rationale, deployment), the Wiki page summarizes and links to the `docs/` source rather than duplicating it — so keeping them in sync means updating one place, not two.

## Path aliases (`tsconfig.json`)

```json
{
  "@/*": ["src/*"],
  "@components/*": ["src/components/*"],
  "@layouts/*": ["src/layouts/*"],
  "@lib/*": ["src/lib/*"],
  "@data/*": ["src/data/*"]
}
```

Used throughout `src/pages/` and `src/components/` (e.g. `import Base from '@layouts/Base.astro'`, `import sitio from '@data/sitio.json'`) instead of relative `../../` paths.
