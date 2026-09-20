# Troubleshooting

Organized by phase. See also the shorter version in the [README](https://github.com/themantas1994/arla/blob/main/README.md#troubleshooting).

## Installation

**`npm install` fails or behaves inconsistently.**
Confirm Node.js ≥ 20.3 (`node -v`); development is done against Node 22 (`.nvmrc` — run `nvm use` if you use `nvm`). If `node_modules` is in a weird state, delete it along with any local lockfile drift and run `npm ci` (a clean install from `package-lock.json`) instead of `npm install`.

**Wrong package manager.**
Only npm is set up (single `package-lock.json`, no `yarn.lock`/`pnpm-lock.yaml`). Using another package manager risks lockfile drift — stick to npm.

## Development

**`npm run dev` works, but the search page (`/pesquisa/`) says the index isn't available.**
Expected, not a bug. Pagefind indexes the *output* of `npm run build` — there is no dev-mode search index. Run `npm run build && npm run preview` to test search.

**A content change doesn't show up in the dev server.**
Astro's dev server watches content files, but if a collection entry has a validation error, the dev server will show the error overlay rather than silently ignoring the file — check the terminal/browser overlay for a Zod validation message naming the collection/entry/field.

**Local CMS editing (`npx decap-server`) doesn't save.**
Confirm both `npx decap-server` and `npm run dev` are running simultaneously (two terminals), and that `public/admin/config.yml` still has `local_backend: true`. This local backend writes straight to your working directory's files — check `git status` after a save to confirm.

## Build

**`npm run build` fails with `[InvalidContentEntryDataError]`.**
This is the Zod schema in `src/content.config.ts` doing its job — a required field is missing, or an enum field (e.g. a repeater's `banda` or `estado`) has a value outside the allowed set. The error message names the collection, the entry, and the specific field:
```
[InvalidContentEntryDataError] eventos → workshop-2026
  inicio: Required
```
Fix the named field in the source file and rebuild. See [Repeater Data](Repeater-Data#validation) and [Content Management](Content-Management) for the exact schemas.

**Build succeeds but search doesn't work in the deployed site.**
The deploy is missing `dist/pagefind/` — someone deployed only the `astro build` output without also running (or including the output of) `pagefind --site dist`. Both steps are bundled in `npm run build`; make sure whatever deploy process is used runs the full script, not a partial one.

**Type errors from `npm run check`.**
The project uses `astro/tsconfigs/strict` with `strictNullChecks: true` and no suppressions configured — a type error here almost always points at a real mismatch (e.g. a component assuming a field is always present when the schema marks it `.optional()`). Fix at the source rather than adding a type assertion to silence it.

**Lint errors / "how do I lint".**
There is no separate linter configuration (no `.eslintrc`, no Prettier config) in this repository. `npm run check` (TypeScript via `astro check`) is the closest equivalent to a lint gate that currently exists.

## Runtime (in the browser)

**Images referenced from content don't load.**
Check the path is correct relative to `public/` — e.g. `imagem: "/imagens/conteudo/foto.jpg"` must correspond to an actual file at `public/imagens/conteudo/foto.jpg`. Images uploaded through the CMS land in `public/imagens/conteudo/` automatically (`media_folder` in `public/admin/config.yml`); a file placed manually elsewhere needs its reference path adjusted to match, not the other way around.

**The map doesn't render.**
Confirm JavaScript is enabled — `Mapa.astro` requires it to initialize Leaflet (there's a `<noscript>` fallback message, plus the always-present text list of locations). If JS is enabled and it still doesn't render, check the browser console: Leaflet is bundled with the site (no CDN dependency), so a failure here is more likely an `IntersectionObserver` support issue (extremely unlikely in any modern browser) or a marker-data JSON parsing problem — check `data-marcadores` on the map's container element for malformed JSON.

**Repeater filters show zero results even though data looks right.**
Check the `filtros` array on the affected repeater entries in `src/data/repetidores.json` — a repeater missing the right filter keys (`vhf`/`uhf`, `analogico`/`dmr`/`dstar`/`aprs`) will render fine unfiltered but vanish the moment any filter is applied. See [Repeater Data](Repeater-Data#filtering-and-search-tabelarepetidoresastro).

## Content

**A repeater/event/article is missing from a listing.**
Check `rascunho: true` (drafts are excluded from production builds — only visible under `npm run dev`) and, for events, check `estadoEvento()`'s date-based classification (see [Events](Events#date-handling-and-status-logic)) — a past event legitimately moves out of the "upcoming" list automatically.

**An old fact needs correcting, but it's in a historical article.**
Don't silently rewrite historical text — per the project's own editorial convention (`docs/gestao-de-conteudos.md`), mark it `historico: true` with a `notaHistorica` explaining the current situation, rather than editing the original claim. See [Articles and News → Archive behavior](Articles-and-News#archive-behavior).

## Deployment

**A legacy URL (from the old WordPress site) 404s instead of redirecting.**
Confirm the redirect actually exists in `src/lib/redirects.mjs` (189 entries, not exhaustive of every URL that ever existed on the old site — see [`docs/mapa-de-redirecoes.md`](https://github.com/themantas1994/arla/blob/main/docs/mapa-de-redirecoes.md)), and confirm the deployment target is reading the right redirect format: Apache needs `.htaccess` (check it was actually uploaded — many FTP clients hide dotfiles), Netlify/Cloudflare Pages need `_redirects`, other hosts fall back to Astro's generated `meta refresh` pages.

**Deployment doesn't reflect a change.**
1. Confirm the build actually succeeded.
2. Hard-refresh (`Ctrl`+`F5` / `Cmd`+`Shift`+`R`).
3. Purge any CDN/Cloudflare cache in front of the host.
4. Confirm the change was actually committed (`git log`) and reached the deployed branch — remember there's no CI/CD (see [CI/CD](CI-CD)), so a deploy is only as current as the last manual upload.

## CI

There is no CI system configured in this repository (see [CI/CD](CI-CD)) — there is nothing to troubleshoot here yet. If your organization has since added one outside of what's documented in this Wiki, refer to that pipeline's own logs; this page reflects the repository as of the last Wiki update.
