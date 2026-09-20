# Contributing

## Branching

No branch-naming convention is enforced by tooling or documented policy in this repository. Branch from `main` and open a pull request against it.

## Commit style

The existing commit history uses descriptive, imperative-mood **Portuguese** subjects for content/architecture work, e.g.:

```
Redesenhar por completo o sítio da ARLA: Astro, CMS e migração de conteúdos
Limpar guião de QA inexistente e completar os comandos no README
```

For consistency with the project (whose content, CMS labels, and most code comments are in Portuguese), prefer Portuguese commit messages for anything touching content, the content model, or association-facing docs. English is acceptable for code-only changes (refactors, dependency bumps, tooling) where no existing convention is being extended. There's no enforced commit-message format (no Conventional Commits tooling configured) — match the tone of nearby history rather than inventing a new scheme.

## Before opening a pull request

Run, at minimum:

```bash
npm run check
npm run build
npm run lint:links
```

For anything touching components, layouts, styles, or content rendering:

```bash
npm run preview &
npm run qa
```

There is **no CI system** to catch these automatically (see [CI/CD](CI-CD)) — this manual pass is currently the entire quality gate, so treat it as mandatory rather than optional.

## Code style

- Follow the conventions already present in the file you're editing rather than introducing a new pattern. In practice this means:
  - Scoped `<style>` blocks per `.astro` component, using the design tokens in `src/styles/global.css` (`var(--accent)`, `var(--e-4)`, etc.) instead of hardcoded values — see [Styling and Design System](Styling-and-Design-System).
  - `interface Props` declared and destructured at the top of a component's frontmatter — see [Components](Components#conventions).
  - Portuguese for user-facing strings, content-model field names (`titulo`, `resumo`, `estado`), and component names — this is a Portuguese association's site, and the entire content model, CMS UI, and most identifiers are already in Portuguese. Don't introduce English field names into new schemas.
  - No CSS framework, no client-side framework — see [Architecture](Architecture#rendering-strategy) for why, and don't reintroduce one for convenience.
- There's no linter/formatter config in the repo (no ESLint, no Prettier) — `npm run check` is the closest thing to an automated style gate.

## Content changes

New/updated articles, events, or repeater data can be contributed either through `/admin/` (if you have GitHub write access — see [Deployment → Configuring the content editor](Deployment#configuring-the-content-editor)) or as a normal pull request editing the Markdown/JSON files directly. Both produce identical results, since Decap CMS has no storage of its own beyond the repository. See [Content Management](Content-Management), [Articles and News](Articles-and-News), [Events](Events), and [Repeater Data](Repeater-Data) for the exact schemas and step-by-step examples.

**Never silently alter a historical fact** — the project's own convention (documented in `docs/gestao-de-conteudos.md`) is to preserve what was originally published and add a dated note (`historico`/`notaHistorica`) when something has changed, rather than rewriting the record. This applies to code contributions too: if you're fixing migrated content, prefer the "add a note" pattern over quietly changing the original claim.

## Documentation

Update the relevant place alongside any change that affects how the site is built, deployed, or content is authored:

- **`docs/`** (Portuguese) — for anything the association's board needs to know: a change to the content-editing workflow, a new deployment step, updated QA results.
- **This Wiki** (English) — for anything a developer needs to know: new components, schema changes, new routes, new scripts.

Avoid duplicating the same explanation in both places — cross-link instead, as the existing pages do.

## Review expectations

There is no formal review-required branch protection configured in this repository as of this writing (no CI, no required status checks visible in the repo config) — but that's a gap to be careful with, not a license to skip verification. Run the checks in "Before opening a pull request" regardless of whether anything enforces them.
