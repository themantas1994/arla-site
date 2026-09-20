# ARLA Website — Developer Wiki

**ARLA** (Associação de Radioamadores do Litoral Alentejano — Amateur Radio Association of the Alentejo Coast) is a Portuguese non-profit amateur radio association, callsign **CS5ARLA**, based in Santiago do Cacém. This repository is the source for its public website, [www.cs5arla.pt](https://www.cs5arla.pt): a full rebuild of a previous WordPress site as a static [Astro](https://astro.build) site with Git-backed content.

This Wiki is the **deep technical reference** for developers working on the codebase: architecture rationale, the exact content and data models, component conventions, deployment and CI/CD, and troubleshooting. It intentionally does not repeat what's in the [README](https://github.com/themantas1994/arla/blob/main/README.md) — start there for a project overview, the technology stack, and the quick-start commands.

There is also a `docs/` directory in the repository, written in **Portuguese** for the association's own non-technical maintainers: it documents *why* architectural decisions were made, the content-migration audit, the CMS editing workflow for board members, and recorded QA results. This Wiki cross-links to it where relevant rather than duplicating it.

## Recommended reading path

1. **[Architecture](Architecture)** — how the site is put together and why, with diagrams.
2. **[Project Structure](Project-Structure)** — what every directory and key file does.
3. **[Local Development](Local-Development)** — get a working dev environment.
4. **[Content Management](Content-Management)** and **[Repeater Data](Repeater-Data)** — the content and data model, in depth.
5. **[Articles and News](Articles-and-News)** and **[Events](Events)** — the editorial content lifecycle.
6. **[Components](Components)** and **[Styling and Design System](Styling-and-Design-System)** — the UI layer.
7. **[Routing](Routing)** — the full route table.
8. **[SEO](SEO)**, **[Accessibility](Accessibility)**, **[Performance](Performance)** — cross-cutting quality concerns.
9. **[Testing](Testing)**, **[Deployment](Deployment)**, **[CI/CD](CI-CD)** — shipping changes.
10. **[Security](Security)**, **[Troubleshooting](Troubleshooting)**, **[Contributing](Contributing)** — reference material.

## What this project actually is (and isn't)

- It **is** a static site: every page is generated once, at build time, from Markdown and JSON files stored in this Git repository. There is no database and no server-side application code running in production.
- It **is** content-managed: the association's board edits news, events, and technical data (repeaters, beacons, governing bodies) through [Decap CMS](https://decapcms.org) at `/admin/`, which commits directly to this repository via GitHub OAuth.
- It **is not** built with React, Vue, or any client-side framework — Astro ships zero JavaScript by default, and the handful of interactive widgets (the map, the repeater filter/search, the theme toggle) are small, framework-free `<script>` blocks.
- It **is not** internationalized yet — all content and UI strings are Portuguese (`pt-PT`); the architecture leaves room for adding a second locale later (see [Architecture](Architecture#future-directions)) but nothing is implemented.
- There **is no CI/CD pipeline** in the repository today (no `.github/workflows/`) and **no automated test suite** in the unit-test sense — verification is a set of Node.js/Playwright scripts run manually. See [CI/CD](CI-CD) and [Testing](Testing).
