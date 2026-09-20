# Content Management

This page is the developer-facing view of how content is modeled and edited. For the association's own step-by-step editing guide (Portuguese, written for non-developers), see [`docs/gestao-de-conteudos.md`](https://github.com/themantas1994/arla/blob/main/docs/gestao-de-conteudos.md).

## The two editing paths

1. **`/admin/` (Decap CMS)** — a form-based editor, configured in `public/admin/config.yml`. It authenticates editors via GitHub OAuth (see [Deployment](Deployment#configuring-the-content-editor)) and commits changes directly to the repository through the GitHub API. Every save is a real Git commit — `commit_messages` in `config.yml` templates them as `Conteúdo: criar/atualizar/remover {{collection}} "{{slug}}"`.
2. **Direct Git edits** — every content file is plain Markdown or JSON; editing and committing them by hand is equally valid and produces identical results, since Decap CMS has no database of its own — the files *are* the source of truth.

Both paths go through the same validation: `npm run build` (and `npm run check`, and Astro's dev server) validate every collection entry against the Zod schemas in `src/content.config.ts`. A required field left empty fails the build with the specific file and field named — this is intentional, since this site publishes data (repeater frequencies, IBAN, membership fee) that would be actively harmful if silently wrong.

## Content Collections (`src/content.config.ts`)

| Collection | Source | Loader | Purpose |
| --- | --- | --- | --- |
| `noticias` | `src/content/noticias/*.md` | `glob` | News articles |
| `tecnica` | `src/content/tecnica/*.md` | `glob` | Technical articles |
| `eventos` | `src/content/eventos/*.md` | `glob` | Events/activities |
| `paginas` | `src/content/paginas/*.md` | `glob` | Long-form editorial pages |
| `repetidores` | `src/data/repetidores.json` | `file` (unwrapped via `listaEm('repetidores')`) | Repeater directory — see [Repeater Data](Repeater-Data) |
| `balizas` | `src/data/balizas.json` | `file` (unwrapped) | Beacon directory |
| `documentos` | `src/data/documentos.json` | `file` (unwrapped) | Document library |
| `ligacoes` | `src/data/ligacoes.json` | `file` (unwrapped) | Curated external links |
| `faq` | `src/data/faq.json` | `file` (unwrapped) | FAQ entries |

Not modeled as Content Collections (read directly as JSON imports instead, e.g. `import sitio from '@data/sitio.json'`): `sitio.json` (site-wide settings), `orgaos-sociais.json`, `direcao-tecnica.json`, `associados.json`, `cronologia.json`. These are singular documents rather than lists of independently-validated entries, so they're consumed as plain typed objects rather than through `getCollection()`.

### Why JSON files wrap their array in a key

```json
{ "repetidores": [ { "id": "cq0pla", "...": "..." }, { "...": "..." } ] }
```

Decap CMS cannot edit a JSON file whose root is a bare array — every data file therefore wraps its list under a named key, and `content.config.ts` defines a small parser, `listaEm(chave)`, that unwraps it for Astro's `file()` loader:

```ts
const listaEm = (chave: string) => (texto: string) => {
  const dados = JSON.parse(texto);
  return Array.isArray(dados) ? dados : (dados[chave] ?? []);
};
```

Don't remove the wrapper key even if a schema looks like it "should" just be an array — it will break the CMS editor for that collection.

## Editorial content example: pages (`paginas` collection)

Simplest schema in the project — used for long-form institutional text (About ARLA, What is amateur radio, Being a radio amateur, Legal notice):

```yaml
---
titulo: "A ARLA"
resumo: "Fins, objetivos e área de implantação da associação."
atualizado: "2026-01-15"
autor: "Direção"
indice: true
---
```

Unlike `noticias`/`tecnica`/`eventos`, `paginas` in the CMS is configured with `create: false` and `delete: false` — new pages of this type require a developer to add a route (see [Routing](Routing)), they can't be created ad hoc from the CMS.

## Document library example

`src/data/documentos.json`, one entry per document:

```json
{
  "id": "estatutos-arla",
  "nome": "Estatutos da ARLA",
  "categoria": "Estatutos",
  "ficheiro": "/documentos/estatutos-arla.pdf",
  "tipo": "PDF",
  "tamanho": "109 KB"
}
```

To add a document: upload the file via the CMS's **Media** picker (or drop it into `public/documentos/`), then add a matching entry under **Recursos → Documentos** (or directly in the JSON) with `ficheiro` pointing at its public path.

## Field conventions worth knowing

- **`rascunho` (draft)** — on `noticias`/`tecnica`/`eventos` entries, excludes the entry from production builds; visible only when running `npm run dev` (`import.meta.env.DEV`), via the `publicado()` filter in `src/lib/conteudo.ts`.
- **`historico` + `notaHistorica`** — marks aged-out content without deleting it. The article stays live and searchable, but the UI shows a dated-content warning banner and an "Archive" label in listings. See [Articles and News](Articles-and-News#archive-behavior).
- **`urlAntigo`** — records the entry's URL on the old WordPress site, purely for redirect bookkeeping/traceability; not rendered anywhere on the page. Don't remove it from migrated content without checking [`docs/mapa-de-redirecoes.md`](https://github.com/themantas1994/arla/blob/main/docs/mapa-de-redirecoes.md).
- **`imagemAlt`** — the CMS labels this as effectively required whenever `imagem` is set (accessibility); the schema itself makes it optional, so nothing blocks a build if it's missing — it's a content-quality convention, not an enforced constraint.

## Related pages

- [Repeater Data](Repeater-Data) — the network directory's data model in full.
- [Articles and News](Articles-and-News) — the news/technical-article lifecycle.
- [Events](Events) — the event schema and date/status logic.
