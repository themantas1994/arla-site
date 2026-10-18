# CLAUDE.md: CS5 Arla site

Astro site, content in Portuguese. Node version in `.nvmrc`. Scripts and CI checks are named in
Portuguese (`validar:*`, `redirecoes:*`, `audit:*`); see `package.json`.
Keep all user-facing text in European Portuguese.

## Model routing for this repo
- Sonnet: pages, components, content schemas, scripts.
- Haiku (`explorer`): finding content, summarizing QA/SEO reports, mechanical content edits.
- Opus: rarely needed here.

## Verification (same as CI)
1. `npm ci` (first time)
2. `npm run validar` (types, redirects, schemas, data, documents, unit tests)
3. `npm run build` then `npm run lint:links` and `npm run audit:seo`
4. Layout, accessibility or CSP changes: `npx astro preview --port 4321` then `npm run qa`
   (axe-core, responsive, functional; needs the Playwright Chromium)

Use the modern-web-guidance skill before writing new HTML/CSS/JS.
