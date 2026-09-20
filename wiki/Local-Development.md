# Local Development

## Prerequisites

- **Node.js ≥ 20.3** (`package.json` → `engines.node`). Development is done against **Node 22** (`.nvmrc`) — run `nvm use` if you use `nvm`.
- npm (the only package manager configured; there's a single `package-lock.json`, no `yarn.lock`/`pnpm-lock.yaml`).
- No database, no external service accounts, and no environment variables are required (see the README's [Environment Variables](https://github.com/themantas1994/arla/blob/main/README.md#environment-variables) section — there's exactly one optional variable, `PUBLIC_SITE_URL`).

## Clone and install

```bash
git clone https://github.com/themantas1994/arla.git
cd arla
npm install
```

## Development server

```bash
npm run dev
```

Runs `astro dev`, serving the site at **http://localhost:4321** with hot module reload for `.astro`, `.ts`, `.css`, and content files (Markdown/JSON changes trigger a reload too, since they're read through Astro's content loader).

### Search doesn't work in dev — this is expected

The site's search (`/pesquisa/`) is powered by [Pagefind](https://pagefind.app), which builds its index by scanning the **generated HTML in `dist/`** after `astro build` runs. There's no dev-mode equivalent. If you need to test search locally:

```bash
npm run build
npm run preview
```

Then visit `http://localhost:4321/pesquisa/` (the port `astro preview` uses by default).

## Editing content locally with Decap CMS

`public/admin/config.yml` has `local_backend: true`, which lets you run the CMS's editor UI against your local filesystem instead of the real GitHub-backed repository — useful for trying out content changes without touching the actual repo history:

```bash
npx decap-server        # terminal 1 — the local backend proxy
npm run dev              # terminal 2
```

Then open `http://localhost:4321/admin/`. Saves write directly to the local files under `src/content/` and `src/data/`.

## Type checking

```bash
npm run check
```

Runs `astro check` (via `@astrojs/check`), which type-checks `.astro`, `.ts` files against `tsconfig.json` (extends `astro/tsconfigs/strict`, with `strictNullChecks` on). Run this before committing — there's no CI to catch type errors yet (see [CI/CD](CI-CD)).

## Debugging

- **Content validation errors** surface at build/dev time as `[InvalidContentEntryDataError]`, naming the collection, entry filename, and the specific field that failed Zod validation — read the message, it's precise.
- **Client-side script errors** (map, repeater filter, theme toggle) show up in the browser console as usual; these are plain `<script>` tags inside `.astro` components, not bundled through a framework, so source maps map back to the component file directly in most cases.
- **Astro's own error overlay** appears in the browser during `npm run dev` for build-time errors in a page/component.

## Build and preview

```bash
npm run build      # astro build && pagefind --site dist
npm run preview    # serves dist/ locally, as production would
```

`npm run preview` is required (not just `npm run dev`) to validate anything that depends on the final build: search, the sitemap, RSS feed content, and the QA/audit scripts described in [Testing](Testing) and [Performance](Performance), all of which expect a server serving `dist/`.

## Full pre-submission loop

```bash
npm run check
npm run build
npm run preview &
npm run lint:links
npm run qa
npm run audit:seo
npm run audit:desempenho
```

See [Testing](Testing) for what each of these actually verifies.
