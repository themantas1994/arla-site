# Performance

## What's implemented

| Technique | Detail |
| --- | --- |
| Zero JS by default | Astro ships no client-side JS unless a component includes a `<script>`; most pages ship none at all |
| Image optimization for migrated media | `scripts/otimizar-media.mjs` (Sharp): resize to max 1600px width, mozjpeg/palette-PNG re-encoding — reduced the migrated image set from 68MB to 18MB |
| Video re-encoding | The two migrated `.mp4` files were re-encoded to H.264 CRF 28, 1280px, with `+faststart` — 40MB → 4MB |
| No downloaded web fonts | System font stack (`--fonte-base`) — instant text render, no FOUT/FOIT |
| Single CSS file | ~20KB compressed, using `@layer` for predictable cascade |
| Deferred map and search | `IntersectionObserver` (map) and dynamic `import()` (Leaflet) — nothing map-related loads until a map is actually visible; the Pagefind index is only fetched when the search page is used |
| Lazy below-the-fold images | `loading="lazy"`, `decoding="async"`, and explicit `width`/`height` (or `image: { layout: 'constrained' }` in `astro.config.mjs` where Astro's `<Image>`/`getImage()` APIs are used) to avoid layout shift |

**Note on the Astro Image integration:** `astro.config.mjs` sets `image: { responsiveStyles: true, layout: 'constrained' }`, which applies to Astro's built-in `<Image>` component and `getImage()` helper. Content pages currently reference migrated images with plain `<img src="/imagens/conteudo/…">` paths rather than `<Image>`, so this setting is available for future use but isn't the mechanism behind the current image sizing — the actual size reduction for existing content comes from the one-off `otimizar-media.mjs` script, not build-time transformation.

## Code splitting / lazy loading

There's no bundler-level code-splitting configuration to speak of, because there's very little JavaScript to split: each interactive component (map, repeater filter, theme toggle, search, copy button) ships its own small, independent script, loaded only on the page(s) that include that component. The heaviest piece, Leaflet, is dynamically `import()`-ed only inside `Mapa.astro`'s `<script>`, and only once the map element intersects the viewport — see [Architecture](Architecture#rendering-strategy).

## Static generation

The entire site is prerendered at build time (`astro build`) — there is no incremental static regeneration, no on-demand rendering, and no CDN edge computation involved in generating a page; every route already exists as a static file the moment the build finishes.

## Caching

No explicit cache-control configuration exists in this repository for the current Apache deployment — `public/.htaccess` sets security headers but not `Cache-Control`/`Expires` rules. Whatever caching behavior is in effect on the live site comes from the hosting provider's defaults, not from anything checked into the repo. This is worth revisiting if performance work continues (see [Security](Security) for the related, and similarly unconfigured, Content-Security-Policy header).

## External scripts

None load by default. See [Architecture → External services](Architecture#external-services) for the three deferred exceptions (OpenStreetMap tiles, HamQSL/NOAA panel images, Decap CMS).

## Measuring performance

```bash
npm run build
npm run preview &
npm run audit:desempenho
```

`scripts/auditar-desempenho.mjs` uses Playwright to measure Core Web Vitals (LCP, FCP, CLS via `PerformanceObserver`, the same mechanism real field tools use) at 390px width, under simulated **slow 4G** (1.6 Mbit/s, 150ms latency), **4× CPU throttling**, with a cold cache — a deliberately pessimistic, mobile-first measurement, matching the actual primary use case (a member checking repeater info in the field).

Latest recorded results (`docs/qualidade.md`, measured against the reference thresholds LCP ≤2500ms / CLS ≤0.1):

| Page | Weight | Requests | LCP | CLS |
| --- | --- | --- | --- | --- |
| Homepage | 252 kB | 8 | 704 ms | 0 |
| Repeaters | 167 kB | 6 | 596 ms | 0 |
| News | 272 kB | 6 | 496 ms | 0 |
| Long technical article | 152 kB | 4 | 616 ms | 0 |
| Events | 106 kB | 4 | 520 ms | 0 |
| Contacts (with map) | 107 kB | 6 | 544 ms | 0 |

All measured pages land under a third of the LCP threshold, and CLS is 0 on every page tested. For comparison, the same measurement on the previous WordPress homepage: 1364kB / 47 requests / 440kB of JS versus the new site's 252kB / 8 requests / 5kB of JS — an 82% weight reduction and a 99% JS reduction, per `docs/qualidade.md`.

## Guidelines for keeping it this way

- Don't add a client-side framework or a JS bundle "for convenience" — the near-zero JS baseline is deliberate architecture, not an accident (see [Architecture](Architecture#rendering-strategy)).
- New images should go through the same optimization approach as `scripts/otimizar-media.mjs` (resize + re-encode) before being committed, especially for anything migrated in bulk.
- New third-party embeds should be deferred (lazy `IntersectionObserver` load, `loading="lazy"`, or a dynamic `import()`), matching the pattern already used for the map and space-weather panels.
- Re-run `npm run audit:desempenho` after any change that adds images, scripts, or third-party requests to a page.
