# Styling and Design System

There is no CSS framework, preprocessor, or CSS-in-JS setup — no Tailwind, no Sass, no CSS Modules. The entire design system lives in one file, [`src/styles/global.css`](https://github.com/themantas1994/arla/blob/main/src/styles/global.css) (~500 lines), imported once by `Base.astro`, plus each component's own scoped `<style>` block for component-specific rules.

## Why one global stylesheet

`build: { inlineStylesheets: 'auto' }` in `astro.config.mjs` lets Astro decide whether to inline small stylesheets or link them; combined with a single, fairly compact global file (~20KB compressed, per `docs/qualidade.md`), the site avoids the request/render overhead of a utility-class framework's generated CSS while keeping every visual rule in one auditable place. Native CSS `@layer` is used within `global.css` to keep cascade order predictable without needing a build-time CSS-in-JS solution.

## Design tokens (CSS custom properties)

All defined in `:root` (dark theme, the default) and overridden for light theme — see [Themes](#themes) below.

### Brand and status colors

```css
--arla-500: #0082c8;  --arla-400: #2c9fe0;  --arla-300: #64bdf0;  --arla-200: #a8dcfa;
--arla-600: #0068a3;  --arla-700: #08507e;  --arla-900: #072f4a;

--sinal:  #2dd4a7;   /* operational — dark theme */
--alerta: #f0a32c;   /* maintenance — dark theme */
--falha:  #f2604c;   /* down — dark theme */
```

Light theme redefines `--sinal`/`--alerta`/`--falha` to `#0a6e53` / `#9a6100` / `#c0392b` — not simple inversions, but independently chosen for correct contrast against the light background (see [Accessibility](Accessibility) for the specific contrast fix this required: the original green failed 4.5:1 on light backgrounds and was darkened).

### Spacing scale

```css
--e-1: 0.25rem;  --e-2: 0.5rem;   --e-3: 0.75rem;  --e-4: 1rem;
--e-5: 1.5rem;   --e-6: 2rem;     --e-7: 3rem;
--e-8: clamp(3rem, 6vw, 4.5rem);
--e-9: clamp(4rem, 9vw, 7rem);
```

The largest two steps use `clamp()` for fluid scaling between mobile and desktop viewport widths, rather than a fixed value plus a separate breakpoint override.

### Type scale

```css
--t-xs: 0.78rem;   --t-sm: 0.875rem;  --t-base: 1rem;   --t-md: 1.0625rem;
--t-lg: clamp(1.125rem, 0.5vw + 1rem, 1.3rem);
--t-xl: clamp(1.35rem, 1vw + 1.1rem, 1.7rem);
--t-2xl: clamp(1.6rem, 1.8vw + 1.2rem, 2.25rem);
--t-3xl: clamp(2rem, 3vw + 1.2rem, 3rem);
--t-4xl: clamp(2.4rem, 5vw + 1.1rem, 4.2rem);
```

### Typography

```css
--fonte-base: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, …;
--fonte-mono: ui-monospace, "SFMono-Regular", "JetBrains Mono", "Cascadia Mono", …;
```

**No web fonts are loaded.** The type stack is entirely OS system fonts — this is a deliberate performance/privacy choice (no Google Fonts request, no third-party dependency, instant text rendering), recorded in `docs/arquitetura.md` under "nothing third-party in the critical path".

### Radii, layout, motion

```css
--raio-sm: 6px;   --raio: 12px;   --raio-lg: 18px;   --raio-xl: 26px;
--largura: 1200px;        /* max content width */
--largura-texto: 72ch;    /* prose measure for long-form text */
--transicao: 160ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Themes

Dark is the default theme (matches the ARLA logo, which is white-on-transparent, and is the preference of most of the site's technical audience per `docs/arquitetura.md`). The light theme is **not an inversion** — it has its own independently-tuned values for every token, including status colors.

- The active theme is applied as `data-tema="escuro"` / `data-tema="claro"` on `<html>`.
- Without an explicit user choice, `@media (prefers-color-scheme: light)` picks the light theme automatically.
- `AlternarTema.astro`'s toggle writes the explicit choice to `localStorage` (key `arla-tema`); every `localStorage` access is wrapped in `try`/`catch` so the toggle still functions (falling back to system preference) in private browsing or with storage blocked.
- An inline script in `Base.astro` sets `data-tema` **before first paint**, avoiding a flash of the wrong theme.
- `prefers-reduced-motion: reduce` disables the hero spectrum animation, status-badge pulsing, and other transitions site-wide.

## Breakpoints (from actual `@media` rules)

| Breakpoint | Used for |
| --- | --- |
| `640px` (min-width) | Increases base content padding (`.envolvente`) |
| `860px` (min-width) | The key structural breakpoint: data tables switch from `<table>` to a card list (`.so-largo`/`.so-estreito` in `TabelaRepetidores.astro` and similar components) |
| `hover: hover` + `prefers-reduced-motion: no-preference` | Gates hover-only visual effects so touch devices and reduced-motion users don't get them |
| `print` | A dedicated print stylesheet: hides filters/copy buttons, forces table layout even below 860px |

There is no fixed set of "sm/md/lg/xl" breakpoint tokens as CSS variables — breakpoints are written directly in `@media` queries at the point they're needed, matched to actual layout needs (e.g. the 860px table/card switch) rather than a generic scale.

## Adding new UI while keeping the design consistent

1. Use the existing custom properties for color, spacing, radius, and type size — never a hardcoded hex value or `px`/`rem` literal for something that already has a token.
2. Put component-specific styles in that component's own scoped `<style>` block; only add to `global.css` for something genuinely global (a new token, a base element style, a new print rule).
3. If a new status/state needs a color, follow the `--sinal`/`--alerta`/`--falha` pattern: define both a dark- and light-theme value, and never rely on color alone to convey the state (pair it with a symbol/text, as `DistintivoEstado.astro` does).
4. Check both themes and at least the 375px/860px/1280px breakpoints before considering a UI change done — this project has already found and fixed several contrast and overflow bugs at those exact boundaries (see [`docs/qualidade.md`](https://github.com/themantas1994/arla/blob/main/docs/qualidade.md), "Revisão visual" and "O que foi corrigido durante os testes").
