# Accessibility

Target: **WCAG 2.2 AA**. This page is the developer-facing detail behind the [README's Accessibility section](https://github.com/themantas1994/arla/blob/main/README.md#accessibility); measured results live in [`docs/qualidade.md`](https://github.com/themantas1994/arla/blob/main/docs/qualidade.md).

## What's implemented

- **Semantic landmarks** (`header`, `nav`, `main`, `article`, `section`, `aside`, `footer`) with a page-by-page verified heading hierarchy (no skipped levels, exactly one `<h1>` per page).
- **Nothing depends on hover.** Dropdown submenus in `Cabecalho.astro` open on click and on keyboard (`Enter`), close on `Escape`; hover is purely an enhancement for mouse users, never the only way to reach a menu item.
- **Visible focus** via `:focus-visible` with a 3px outline, applied consistently, plus a "skip to content" link as the first focusable element on every page (in `Base.astro`).
- **Accessible data tables**: `<caption>`, `<thead>`, `scope="col"` on header cells, and the table→card responsive pattern (see [Styling and Design System](Styling-and-Design-System#breakpoints)) instead of a horizontally-squeezed table on narrow screens.
- **Status is never color-only.** `DistintivoEstado.astro` always pairs a symbol (`●` `◐` `✕` `?`) with text — verified to remain legible in black-and-white print.
- **Touch targets** ≥44×44px on primary interactive controls (filter chips, buttons, footer links).
- **`aria-live="polite"` regions** announce dynamic state changes to screen readers — e.g. `BotaoCopiar.astro` confirms a copied frequency, and the repeater filter's result count updates live.
- **Every map has a full text alternative.** `Mapa.astro` always renders a `<details>` element listing every marker's title, description, and coordinates as plain text — present regardless of JavaScript or visual map rendering.
- **`prefers-reduced-motion: reduce`** disables the hero spectrum background animation, status-badge pulsing, and CSS transitions site-wide.
- **Language declared** (`lang="pt-PT"`) on every page.

## How it's measured

`scripts/qa.mjs` runs [axe-core](https://github.com/dequelabs/axe-core) via Playwright against a real Chromium browser, over every page in both themes, using the `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, and `best-practice` rule sets:

```bash
npm run build
npm run preview &
npm run qa
```

Latest recorded run (`docs/qualidade.md`): **74 scans** (37 pages × 2 themes), **0 violations**, **0 serious/critical violations**.

`scripts/qa.mjs` also runs additional manual-style checks beyond what axe-core covers: touch-target size at 375px width, keyboard operability of submenus, absence of hover-only functionality, single-`<h1>` verification, declared language, and status-never-color-alone verification.

## Defects found and fixed (recorded history, worth knowing before "fixing" similar-looking code)

1. **Insufficient light-theme contrast** — the original "operational" green (`#0f8f6d`) measured 3.51:1 against the light badge background, below the 4.5:1 minimum; darkened to `#0a6e53` (5.4:1). This is why the light and dark themes use *different* status colors rather than one shared value — see [Styling and Design System](Styling-and-Design-System#brand-and-status-colors).
2. **Opacity breaking contrast** — past-event cards used `opacity: 0.86` to visually de-emphasize them, which dropped text contrast to 3.46:1. Fixed by distinguishing past events through background/calendar styling instead of opacity.
3. **Heading hierarchy** — news listing cards used `<h3>` immediately after the page's `<h1>`; `CartaoArtigo.astro`'s heading level was made configurable (`nivel` prop) so each page can maintain a correct hierarchy.
4. **Footer touch targets** — legal links were 15px tall; increased to a 44px touch area.

## Known, stated limitations

Automated axe-core scans verify DOM/ARIA structure — they do not verify actual usability. **Not tested:** real screen readers (NVDA, VoiceOver), keyboard-only navigation by an experienced assistive-technology user, or comprehension by people with reading difficulties. This is recorded explicitly in `docs/qualidade.md` rather than implied as complete — treat these as open work, not finished.

## Guidelines for new UI

- Never encode meaning in color alone — pair with text or an icon, as `DistintivoEstado.astro` does.
- Every interactive control needs a visible focus state and must be operable by keyboard alone — test with `Tab`/`Enter`/`Escape`, not just a mouse.
- New images need meaningful `alt` text (or an explicitly empty `alt=""` for decorative images) — see the `imagemAlt` convention in [Content Management](Content-Management#field-conventions-worth-knowing).
- New data tables should follow the existing `<caption>`/`<thead>`/`scope` + card-fallback pattern, not a bespoke one.
- Run `npm run qa` after any UI change and check both themes.
