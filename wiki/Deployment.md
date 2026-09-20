# Deployment

The production artifact is a static folder — `dist/` — served by any web server. There is no server-side runtime, database, or process to keep alive.

## Build

```bash
npm ci
npm run build      # astro build && pagefind --site dist
```

Both halves matter: `astro build` generates the HTML/CSS/JS, and `pagefind --site dist` then scans that generated HTML to build the search index at `dist/pagefind/`. Deploying only the `astro build` output (skipping Pagefind) silently breaks the search page — there's no error, just an empty index.

If deploying to a domain other than the production one:

```bash
PUBLIC_SITE_URL=https://staging.example.pt npm run build
```

This affects canonical URLs, Open Graph tags, the sitemap, and the RSS feed — see [Environment Variables](https://github.com/themantas1994/arla/blob/main/README.md#environment-variables).

## Verify before publishing

```bash
npm run check
npm run preview &     # http://localhost:4321
npm run lint:links
npm run qa
```

## Current hosting: Apache / cPanel

This is where the site runs today (the same environment the previous WordPress installation used):

1. `npm run build`
2. Upload **the entire contents of `dist/`** to the public web root (`public_html/` or equivalent).
3. **Confirm `.htaccess` was actually uploaded** — it's a hidden file and many FTP clients hide it by default. Without it, there are no 301 redirects and no security headers.
4. Confirm `mod_rewrite` and `mod_headers` are enabled (they are on most shared hosting).

If migrating away from the old WordPress install at `/site/`: keep a full backup before touching it, confirm the new site and its redirects work correctly, then the old installation can be removed — the redirect map (`.htaccess`) handles every legacy URL, so there's no urgency.

## Other hosts (documented, not assumed)

### Netlify or Cloudflare Pages

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 22 |

`public/_redirects` is picked up automatically by both platforms. Every push to the main branch publishes a new deploy.

### Vercel

Same build command and output directory. **`public/_redirects` is not read by Vercel** — Astro's own generated redirect pages still work (so no legacy URL is fully broken), but they use `meta refresh`, not a real HTTP 301. For real 301s on Vercel, add a `vercel.json` with rules translated from `src/lib/redirects.mjs`.

### GitHub Pages

Works, with the same limitation as Vercel and more consequence: GitHub Pages has no server-level redirect mechanism at all, so all 189 legacy URLs would rely on Astro's generated `meta refresh` pages rather than real 301s — worse for search-engine handling of a decade of accumulated inbound links. Prefer a host with real 301 support for this specific site.

## Redirects

189 permanent redirects from the legacy WordPress structure are defined **once**, in `src/lib/redirects.mjs`, and expressed in three formats so whichever host is used gets a working redirect:

| Format | File | Used by |
| --- | --- | --- |
| Astro `redirects` config | `astro.config.mjs` (imports from `redirects.mjs`) | Generates redirect pages that work on any host |
| Apache `mod_rewrite` | `public/.htaccess` | Real server-level 301s on Apache |
| Netlify/Cloudflare format | `public/_redirects` | Real server-level 301s on Netlify/Cloudflare Pages |

Full list documented in [`docs/mapa-de-redirecoes.md`](https://github.com/themantas1994/arla/blob/main/docs/mapa-de-redirecoes.md).

## Configuring the content editor (Decap CMS)

Content editing at `/admin/` needs a GitHub OAuth App and a token-exchange service (GitHub requires the OAuth code-for-token exchange to happen server-side):

1. **Point the CMS at the right repo** — `public/admin/config.yml`: `backend.repo: themantas1994/arla`, `backend.branch: main`.
2. **Create a GitHub OAuth App** (GitHub → Settings → Developer settings → OAuth Apps), with the callback URL pointed at whatever auth service you use (step 3). The client secret never enters the repository.
3. **Auth/token-exchange service** — either Netlify's built-in Git Gateway (if hosted there; switch `backend.name` to `git-gateway`) or a small self-hosted OAuth proxy for Decap (Cloudflare Workers and Netlify Functions implementations exist) referenced via `backend.base_url`.
4. **Local testing without any of the above**: `npx decap-server` + `npm run dev`, with `local_backend: true` already set in `config.yml` — writes go straight to local files.
5. **Granting/revoking editor access** is just GitHub repository collaborator management (Settings → Collaborators, `Write` permission) — there are no separate CMS accounts or passwords.

Full walkthrough: [`docs/implantacao.md`](https://github.com/themantas1994/arla/blob/main/docs/implantacao.md#configurar-o-editor-de-conteúdos).

## Rollback

There is no automated rollback mechanism (no CI/CD pipeline exists — see [CI/CD](CI-CD)). Because content changes are ordinary Git commits, reverting is standard Git: `git revert` the offending commit (or the CMS-generated commit) and redeploy. For a code-level regression, redeploy from a previous known-good commit's build output.

## Domain verification

Confirm `PUBLIC_SITE_URL` (or the default `https://www.cs5arla.pt` in `astro.config.mjs`) matches the actual serving domain — a mismatch here silently produces wrong canonical URLs, Open Graph URLs, sitemap entries, and RSS `<link>` values without any build error.
