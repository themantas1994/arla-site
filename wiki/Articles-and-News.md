# Articles and News

Covers the `noticias` (news) and `tecnica` (technical articles) collections — two schemas that share a common base (`baseArtigo` in `src/content.config.ts`) and mostly identical rendering (`Artigo.astro` layout, `[...slug].astro` routing pattern).

## Data source and format

Plain Markdown files with YAML frontmatter, one file per entry:

- News: `src/content/noticias/*.md` (39 entries)
- Technical articles: `src/content/tecnica/*.md` (8 entries)

## Shared base schema (`baseArtigo`)

```ts
{
  titulo: z.string(),
  resumo: z.string(),
  data: z.coerce.date(),
  atualizado: z.coerce.date().optional(),
  autor: z.string().optional(),
  indicativo: z.string().optional(),        // author's callsign
  imagem: z.string().optional(),
  imagemAlt: z.string().optional(),
  categoria: z.string().default('Geral'),
  etiquetas: z.array(z.string()).default([]),
  historico: z.boolean().default(false),
  notaHistorica: z.string().optional(),
  urlAntigo: z.string().optional(),          // legacy WordPress URL, for redirect bookkeeping
  destaque: z.boolean().default(false),      // feature on homepage
  rascunho: z.boolean().default(false),      // draft — excluded from production builds
  anexos: z.array(z.object({ nome, ficheiro, tipo? })).default([]),
}
```

## `tecnica` additions

```ts
{
  ...baseArtigo,
  indice: z.boolean().default(true),          // show table of contents
  nivel: z.enum(['introducao', 'intermedio', 'avancado']).default('intermedio'),
  referencias: z.array(z.object({ titulo: z.string(), url: z.string() })).default([]),
}
```

## Routing and slugs

`src/pages/noticias/[...slug].astro` and `src/pages/tecnica/[...slug].astro` use `getStaticPaths()` to generate one page per collection entry. **The slug is the filename, without `.md`** — e.g. `src/content/noticias/5-ciclo-raid.md` → `/noticias/5-ciclo-raid/`. There is no separate `slug` frontmatter field; rename the file to change the URL (and update `urlAntigo`/redirect bookkeeping if the article was migrated).

`/noticias/categoria/[categoria].astro` generates one listing page per distinct `categoria` value, slugified by `slugCategoria()` in `src/lib/conteudo.ts` (accent-stripped, lowercased, spaces → hyphens — e.g. "Fim de Semana AM" → `fim-de-semana-am`).

`/noticias/pagina/[pagina].astro` paginates the main news listing.

## Images

Referenced by absolute path under `imagem` (e.g. `/imagens/conteudo/ct1fbf.jpg`), served from `public/imagens/conteudo/`. `imagemAlt` should always be set alongside it — the CMS labels it as required in that case, though the schema itself leaves it optional (see [Content Management](Content-Management#field-conventions-worth-knowing)).

## Dates

`data` (publication date) is the sort key for both collections — `src/lib/conteudo.ts`'s `noticias()` and `tecnica()` both sort by `data` descending. It's also used for the RSS feed (`src/pages/rss.xml.ts`) and the `datePublished` field in JSON-LD structured data (see [SEO](SEO)). `atualizado`, when set, represents a later revision date and is shown alongside the original publish date.

## Categories and tags

`categoria` is free text with a curated `options` list per collection in `public/admin/config.yml` (e.g. news: Geral, Associação, Atividades, Comunicados, Divulgação, Emergência, Instalações, Legislação, Radioamadorismo, Rede ARLA, SSTV) — editors can also type a new one (`create: true` in the CMS config). `etiquetas` is a free-form tag array.

## Related content

`relacionados()` in `src/lib/conteudo.ts` scores candidate entries against the current one: +2 per shared tag, +1 for a matching category, excluding the entry itself; if fewer than the requested count score above zero, it's padded out with the most recent remaining entries. There's no manual "related articles" field to maintain.

## Archive behavior

**Nothing is automatically archived or deleted.** When content ages out of relevance (e.g. a 2019 news item about legislation that has since changed), the convention is to set:

```yaml
historico: true
notaHistorica: "Comunicado de 2019 sobre o processo preparatório da WRC-23. A Conferência já se realizou; verifique a situação atual junto da ANACOM e da IARU."
```

The article stays live and fully searchable, but its page shows a dated-content warning banner built from `notaHistorica` (or a generic one if left blank), and listings tag it "Archive". This preserves the historical record of what the association actually published, rather than editing it after the fact or deleting it. See [`docs/gestao-de-conteudos.md`](https://github.com/themantas1994/arla/blob/main/docs/gestao-de-conteudos.md#assinalar-conteúdo-que-envelheceu) for the association-facing framing of this rule ("never silently change a fact — if a historical text says something outdated, add a note, don't rewrite it").

## Adding a news article — step by step

1. Create `src/content/noticias/nome-do-artigo.md` — the filename becomes the URL slug.
2. Frontmatter, at minimum:
   ```markdown
   ---
   titulo: "Título da notícia"
   resumo: "Um ou dois períodos claros — usado nos cartões, na pesquisa e nas redes sociais."
   data: "2026-09-20"
   categoria: "Associação"
   etiquetas: []
   historico: false
   destaque: false
   ---

   Corpo do artigo, em Markdown normal.
   ```
3. Run `npm run build` or `npm run check` — a missing required field fails immediately with the file and field named.
4. Equivalent CMS path: `/admin/` → **Notícias → New Notícia**.

## Adding a technical article

Same process under `src/content/tecnica/`, adding `nivel` and, optionally, `indice`/`referencias`:

```yaml
---
titulo: "Como receber o QO-100"
resumo: "Guia introdutório de receção via satélite geoestacionário."
data: "2026-09-20"
categoria: "Satélites"
nivel: "introducao"
indice: true
referencias:
  - { titulo: "AMSAT-DL QO-100", url: "https://amsat-dl.org/" }
---
```
