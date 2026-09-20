# Security

## No secrets in the repository

There are no API keys, database credentials, or tokens committed anywhere in this repository. The site requires exactly one optional, non-secret environment variable (`PUBLIC_SITE_URL` — see [Environment Variables](https://github.com/themantas1994/arla/blob/main/README.md#environment-variables)). `.env`, `.env.production`, and `.env.local` are git-ignored as a precaution even though none currently exist.

## No database, no server-side application code

The static-output architecture (see [Architecture](Architecture)) removes an entire category of attack surface that existed in the previous WordPress install: no `wp-admin` login page to brute-force, no plugin ecosystem to keep patched, no SQL injection surface, no PHP runtime.

## Authentication

There is no authentication system in the site itself. The only thing resembling "login" is the Decap CMS editor at `/admin/`, which authenticates content editors entirely through **GitHub OAuth** — the site never sees, stores, or validates a password. Who can edit content is governed by GitHub repository collaborator permissions (`Write` access), not by anything in this codebase. See [Deployment → Configuring the content editor](Deployment#configuring-the-content-editor).

`src/pages/area-reservada.astro` is a placeholder page explaining that the previous WordPress member-login/registration system was not carried over — there is currently **no members-only authenticated area** on the site at all.

## Input handling / sanitization

There is no user-submitted HTML anywhere on the live site — no comments, no forms that persist to a backend. All content is Markdown, authored by people with repository write access (directly or via the CMS) and processed by Astro's Markdown pipeline at build time. This means the traditional "sanitize user input" concern doesn't apply the way it would for a site accepting public submissions — the trust boundary is "who has write access to this Git repository," not "who fills out a public form."

## Security headers

Set in `public/.htaccess` (Apache, the current production host):

```apache
X-Content-Type-Options
Referrer-Policy
X-Frame-Options
Permissions-Policy
Strict-Transport-Security
```

**These are Apache-specific.** Deploying to Netlify, Cloudflare Pages, Vercel, or GitHub Pages (see [Deployment](Deployment)) would need these headers replicated at that platform's own configuration layer (e.g. a `_headers` file for Netlify) — they are not automatically carried over just because the same `dist/` output is deployed.

**No Content-Security-Policy is currently set.** This is a known, explicitly acknowledged gap (`docs/implantacao.md`): a CSP would need to be tuned against the actual production host to avoid blocking the OpenStreetMap tile requests and the HamQSL/NOAA space-weather panel images, both of which are legitimate cross-origin resources the site intentionally loads.

## External links

All external links use `rel="noopener noreferrer"`, preventing the linked page from accessing `window.opener` and suppressing the referrer.

## Admin surface

`/admin/` (Decap CMS) and `/area-reservada/` are both excluded from search indexing via `robots.txt` — this reduces incidental discovery, but is **not** an access control; `/admin/` is still reachable by anyone who requests it directly, and access is enforced entirely by the GitHub OAuth login it requires to actually do anything.

## Dependency updates

No automated dependency-update tooling (no Dependabot config, no Renovate config) exists in the repository. Dependency updates (`package.json`) are a manual `npm update`/`npm install <pkg>@latest` plus a rebuild-and-verify cycle (see [Testing](Testing)) — there's no CI to catch a broken update automatically (see [CI/CD](CI-CD)).

## Practical guidance for contributors

- Never commit a `.env` file, API key, or credential — there is currently nothing of the sort in the repo, and it should stay that way.
- If you add a feature that calls an external API requiring a key, use an environment variable following the `PUBLIC_SITE_URL` pattern (Astro convention: variables prefixed `PUBLIC_` are exposed to client-side code; anything build-time-only and sensitive should **not** use that prefix), and document it in the README's Environment Variables table.
- If you add a new third-party embed or script, review whether it needs a CSP allowance and flag that in your PR — this project currently has no CSP at all, so a new third-party origin doesn't need an update there yet, but should be noted for whenever one is added.
- Any change to `/admin/` or `public/admin/config.yml` should be reviewed carefully — it governs who can write to the content that ends up on the public site.
