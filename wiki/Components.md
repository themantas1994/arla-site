# Components

`src/components/` holds the reusable building blocks; `src/layouts/` composes them into full pages. There's no component library or framework involved — every component is a single `.astro` file with its own markup, a scoped `<style>` block, and (where needed) a scoped `<script>`.

## Conventions

- **Naming is Portuguese**, matching the content-model field names and the site's own language (`Cabecalho` = Header, `Rodape` = Footer, `Migalhas` = Breadcrumbs, `Distintivo` = Badge). Keep new components consistent with this rather than mixing in English names.
- **Props are declared as a TypeScript `interface Props`** at the top of the component's frontmatter fence, destructured with defaults immediately after, e.g. (`DistintivoEstado.astro`):
  ```astro
  ---
  interface Props {
    estado: 'operacional' | 'manutencao' | 'indisponivel' | 'desconhecido';
    compacto?: boolean;
  }
  const { estado, compacto = false } = Astro.props;
  ---
  ```
- **Styling is scoped by default** (Astro's native per-component CSS scoping) and reads from the global design tokens (`var(--accent)`, `var(--e-4)`, etc. — see [Styling and Design System](Styling-and-Design-System)) rather than hardcoding values. `:global()` is used sparingly and deliberately, e.g. to reach into a child component's or third-party library's markup (see `Mapa.astro`'s Leaflet overrides).
- **Data flow is one-directional and prop-driven** — components receive already-validated collection data (typed via `CollectionEntry<'x'>` from `astro:content`) or plain values, and render it; there's no shared client-side state manager. Cross-component coordination (e.g. between a search box and the rows it filters) is done by querying the DOM within one component's own `<script>`, scoped with `document.querySelectorAll('[data-something]')` — see `TabelaRepetidores.astro`.
- **Composition happens in layouts and pages**, not by components importing each other except for small leaf components (icons, badges, copy buttons) used inside a larger one.
- **Reuse pattern for variants**: rather than separate components per visual variant, a component takes a `variante` prop, e.g. `CartaoArtigo.astro`'s `variante?: 'normal' | 'destaque' | 'compacto'` (a "highlight" card gets a bigger image/title) or a `nivel?: 2 | 3 | 4` prop to control which heading level it renders, so the page controls document heading hierarchy without the card component hardcoding an `<h3>`.

## Component catalog

| Component | Purpose |
| --- | --- |
| `Cabecalho.astro` | Site header: logo, main navigation (from `src/lib/navegacao.ts`), mobile menu, theme toggle |
| `Rodape.astro` | Site footer: contact info, quick links, social links |
| `Logotipo.astro` | The ARLA logo/wordmark, as inline SVG |
| `Heroi.astro` | Homepage hero section, with the animated spectrum background and quick stats |
| `FundoEspectro.astro` | The decorative animated spectrum-analyzer background used in the hero |
| `AlternarTema.astro` | Dark/light theme toggle button; persists choice to `localStorage` |
| `Icone.astro` | Central icon registry — renders one of a fixed set of inline SVG icons by name |
| `CartaoArtigo.astro` | News/technical-article listing card (image, title, summary, date, tags) |
| `CartaoEvento.astro` | Event listing card (date/status-aware) |
| `DistintivoEstado.astro` | Operational-status badge (`operacional`/`manutencao`/`indisponivel`/`desconhecido`) — symbol + text, never color alone |
| `TabelaRepetidores.astro` | Repeater/beacon table + mobile card view, with client-side search/filter — see [Repeater Data](Repeater-Data) |
| `Mapa.astro` | Leaflet map, lazy-loaded on scroll into view, with a full text alternative — see [Architecture](Architecture#external-services) |
| `EstadoVazio.astro` | Generic "no results" empty state, used by search, filters, and listings |
| `IndiceConteudos.astro` | Table of contents for long-form pages/articles (built from Markdown headings) |
| `MigalhasPao.astro` | Breadcrumb navigation trail |
| `Paginacao.astro` | Pagination controls for listing pages |
| `Partilhar.astro` | Social-share links for an article/page |
| `BotaoCopiar.astro` | Copy-to-clipboard button (used for frequencies and callsigns), announces success via `aria-live` |
| `Aviso.astro` | Callout/alert box (info, warning, task-needed styles) |

## Layouts

| Layout | Wraps | Adds |
| --- | --- | --- |
| `Base.astro` | Every page | `<head>` metadata (title, description, canonical, OG, Twitter Card, JSON-LD), the pre-paint theme script, `Cabecalho`/`Rodape` |
| `Pagina.astro` | Long-form text pages | Optional table of contents, breadcrumbs, prose width constraint |
| `Artigo.astro` | News/technical-article/event detail pages | Author/date/tag metadata, related-content, share/print, the historical-content warning banner |

## Adding a new component

Follow the pattern of an existing, similar component rather than introducing a new convention:
1. Define `interface Props` and destructure with sensible defaults.
2. Use design tokens (`var(--...)`) from `global.css`, not hardcoded colors/spacing — this is what keeps the light/dark themes and the spacing scale consistent site-wide (see [Styling and Design System](Styling-and-Design-System)).
3. If the component needs client-side behavior, keep the `<script>` scoped to that component (`document.querySelectorAll` under a specific `data-*` attribute), not a global event bus.
4. If the component renders content-model data, type its props from `CollectionEntry<'collection-name'>` (from `astro:content`) rather than a hand-rolled interface, so schema changes in `content.config.ts` surface as type errors here too.
