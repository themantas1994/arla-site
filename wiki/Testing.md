# Testing

There is **no unit-test framework** in this project — no Vitest, Jest, or similar, and no `test`/`*.spec.ts` files exist in the repository. Verification is done through a set of purpose-built Node.js/Playwright scripts plus TypeScript's own type checker, all run manually (see [CI/CD](CI-CD) — none of this is wired into an automated pipeline yet).

## The tools, exactly

| Tool | Command | What it verifies |
| --- | --- | --- |
| `astro check` (`@astrojs/check` + TypeScript) | `npm run check` | Type errors across `.astro`/`.ts` files, against `tsconfig.json` (`astro/tsconfigs/strict`, `strictNullChecks: true`) |
| `scripts/qa.mjs` (Playwright + `@axe-core/playwright`) | `npm run qa` | Accessibility (WCAG rule sets, see [Accessibility](Accessibility)), responsive layout across 7 widths (320–1440px), and functional behavior: repeater/beacon filtering, site search, theme-toggle persistence, keyboard-operable submenus, map initialization, copy-to-clipboard, PDF downloads, 404 page, legacy-URL redirects |
| `scripts/capturas.mjs` | `npm run qa:capturas` | Generates responsive screenshots into `reports/capturas/` for manual visual review — not an assertion-based test |
| `scripts/check-links.mjs` | `npm run lint:links` (`-- --externas` for external links too) | Broken internal links, broken in-page anchors, and (optionally) external link liveness, over the built `dist/` |
| `scripts/auditar-seo.mjs` | `npm run audit:seo` | Metadata completeness, JSON-LD presence/shape, heading hierarchy, sitemap correctness |
| `scripts/auditar-desempenho.mjs` | `npm run audit:desempenho` | Core Web Vitals under throttled network/CPU — see [Performance](Performance) |

All five browser-based scripts (`qa`, `capturas`, `check-links` for external links, `auditar-seo`, `auditar-desempenho`) run against **the built output**, not the dev server — they require `npm run build` followed by `npm run preview` (or another static server pointed at `dist/`) running first, and `check-links`/`auditar-seo` read directly from the `dist/` folder on disk rather than over HTTP.

## Running the full suite before submitting a change

```bash
npm run check
npm run build
npm run preview &
npm run lint:links
npm run qa
npm run audit:seo
npm run audit:desempenho
```

For a small content-only change (a new article, a repeater update), `npm run check` + `npm run build` is usually sufficient — the schema validation in `src/content.config.ts` is the primary safety net for content changes (see [Content Management](Content-Management)). For anything touching components, styles, or layouts, run the full list above, especially `npm run qa`.

## What the functional tests in `scripts/qa.mjs` actually assert (from `docs/qualidade.md`'s recorded run)

17 functional checks in a real Chromium browser, including: repeater band filter narrows 9→5 rows correctly, accent-insensitive repeater search ("arrabida" finds "Arrábida"), Pagefind search returns expected result counts and handles no-results/accent-insensitive cases, mobile menu opens/expands/closes, keyboard-driven submenu (`Enter`/`Escape`, correct `aria-expanded`), theme choice persists across reload, the Leaflet map initializes with correct marker count, archive filtering, PDF downloads return the correct content type, and a sample legacy URL correctly 301-redirects.

## Adding a test

There's no existing test-file convention to extend (no `*.test.ts`), since verification lives in these standalone scripts rather than a test runner. If you need to verify new behavior:
- For **content/data correctness**, add/extend a Zod schema constraint in `src/content.config.ts` — this is the primary "test" mechanism for content and fails the build directly.
- For **new interactive UI**, add a check to `scripts/qa.mjs` following the existing pattern (Playwright page interactions + assertions), rather than introducing a separate test framework.
- For **new pages that need SEO/link coverage**, they're picked up automatically by `check-links.mjs` (scans all of `dist/`) and `auditar-seo.mjs` (same) — no per-page registration needed, unlike `qa.mjs`'s `PAGINAS` list, which does need the new path added explicitly if you want dedicated accessibility/functional coverage for it.
