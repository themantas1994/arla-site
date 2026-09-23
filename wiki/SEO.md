# SEO

Tudo o que o sítio emite para motores de busca é construído no build. Não há plugin de SEO
nem configuração externa: os metadados vêm das props passadas a `Base.astro`.

---

## Metadados por página — IMPLEMENTADO

`src/layouts/Base.astro` recebe:

```ts
export interface Props {
  titulo: string;
  descricao: string;
  imagem?: string;          // predefinição: /imagens/icone-512.png
  tipo?: 'website' | 'article';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  semIndexacao?: boolean;   // acrescenta <meta name="robots" content="noindex, follow">
  publicado?: Date;
  modificado?: Date;
  semPesquisa?: boolean;    // exclui do índice do Pagefind
  classeCorpo?: string;
}
```

E produz:

| Etiqueta | Como é construída |
| --- | --- |
| `<title>` | `{titulo} · ARLA`, ou `ARLA — Associação de Radioamadores do Litoral Alentejano` na página inicial |
| `<meta name="description">` | `descricao`, truncada a ~160 caracteres em fronteira de palavra, com reticências |
| `<link rel="canonical">` | `new URL(Astro.url.pathname, Astro.site)` — absoluto |
| `<meta name="robots">` | Só quando `semIndexacao`; valor `noindex, follow` |
| Open Graph | `og:type`, `og:site_name`, `og:locale` (`pt_PT`), `og:title`, `og:description`, `og:url`, `og:image` |
| `article:published_time` / `article:modified_time` | Quando há `publicado` / `modificado` |
| Twitter Card | `summary_large_image`, com título, descrição e imagem |
| `<link rel="alternate" type="application/rss+xml">` | Aponta para `/rss.xml` |
| Ícones e manifesto | `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `manifest.webmanifest` |
| `theme-color` | Dois valores, um por esquema de cor |

**Nota sobre a descrição:** o texto truncado vai para os metadados; o `resumo` completo
continua a ser usado nos cartões, na pesquisa e no RSS.

---

## Dados estruturados (JSON-LD) — IMPLEMENTADO

Todos os blocos são construídos em TypeScript e serializados num único
`<script type="application/ld+json">` por página. `Base.astro` acrescenta sempre
`Organization`, seguido dos blocos específicos da página.

| Tipo | Onde é gerado | Ocorrências na última auditoria |
| --- | --- | --- |
| `Organization` | `Base.astro` (todas as páginas), com `@id: /#organizacao` | 112 |
| `BreadcrumbList` | `MigalhasPao.astro` | 109 |
| `NewsArticle` | `noticias/[...slug].astro` | 39 |
| `Event` | `eventos/[...slug].astro` | 17 |
| `TechArticle` | `tecnica/[...slug].astro` | 8 |
| `FAQPage` | `recursos/faq.astro` e `radioamadorismo/comecar.astro` | 2 |
| `HowTo` | `arla/ser-associado.astro` | 1 |
| `ContactPage` | `contactos.astro` | 1 |
| `WebSite` (com `SearchAction`) | `index.astro` | 1 |

O bloco `Organization` inclui nome, `alternateName` (sigla e indicativo), logótipo, correio
eletrónico montado a partir das duas partes de `sitio.json`, `foundingDate`, descrição,
`sameAs` (redes sociais), `PostalAddress` e `GeoCoordinates` — tudo a partir de dados
editáveis, nada escrito no código.

O `SearchAction` do `WebSite` aponta para `/pesquisa/?q={search_term_string}`.

---

## Encaminhamento e endereços — IMPLEMENTADO

- Endereços semânticos em português, sem datas no caminho
  (`/noticias/repetidor-dmr-cq0dla/`, não `/2019/07/13/…`).
- `trailingSlash: 'always'` — todos os endereços terminam em `/`. Escreva sempre as ligações
  internas com barra final, para evitar uma redireção desnecessária.
- Os slugs vêm do nome do ficheiro; renomear um ficheiro publicado exige acrescentar uma
  redireção.

---

## Sitemap — IMPLEMENTADO

Gerado por `@astrojs/sitemap`:

```js
sitemap({
  i18n: { defaultLocale: 'pt', locales: { pt: 'pt-PT' } },
  filter: (page) => !page.includes('/area-reservada/'),
})
```

Produz `dist/sitemap-index.xml` e `dist/sitemap-0.xml`. Última execução: **109 endereços**.
As páginas-stub de redireção não entram.

---

## robots.txt — IMPLEMENTADO

```text
User-agent: *
Allow: /
Disallow: /area-reservada/
Disallow: /admin/

Sitemap: https://www.cs5arla.pt/sitemap-index.xml
```

**O endereço do sitemap acompanha `PUBLIC_SITE_URL`.** O `robots.txt` deixou de ser um
ficheiro estático em `public/` e passou a ser gerado no build, por
`src/pages/robots.txt.ts` (auditoria: DOC-017):

```bash
PUBLIC_SITE_URL=https://ensaio.exemplo.pt npm run build
# → dist/robots.txt com «Sitemap: https://ensaio.exemplo.pt/sitemap-index.xml»
```

Antes, o endereço estava escrito literalmente: em qualquer domínio que não fosse o de
produção — uma pré-visualização, um domínio novo — apontava para o sítio errado, e ninguém
dava por isso.

As áreas bloqueadas estão na constante `BLOQUEADAS`, no topo do ficheiro, e **têm de
coincidir com o filtro do sitemap** em `astro.config.mjs`. `npm run audit:seo` verifica o
`robots.txt` gerado.

`Disallow` não é uma fronteira de segurança — mantém estas páginas fora dos resultados de
pesquisa, nada mais.

---

## RSS — IMPLEMENTADO

`src/pages/rss.xml.ts`, com `@astrojs/rss`, publica em `/rss.xml` um feed único com
**notícias, artigos técnicos e eventos**, ordenados por data decrescente. Cada item leva
título, resumo, data, ligação e categorias (a categoria própria mais as etiquetas; os
artigos técnicos levam também `Artigo técnico`, os eventos `Evento`). O feed declara
`<language>pt-PT</language>` e o aviso de direitos de autor com o ano corrente.

---

## Pesquisa interna — IMPLEMENTADO

Pagefind, construído a partir do HTML final. `Base.astro` marca `<main>` com
`data-pagefind-body` (exceto em páginas com `semIndexacao` ou `semPesquisa`) e envolve
cabeçalho e rodapé em `data-pagefind-ignore`, para que não poluam os resultados. A data de
publicação é passada como `data-pagefind-meta`.

Última execução: **108 páginas indexadas, 5636 palavras, 1 idioma (`pt-pt`)**.

> **Defeito corrigido durante a migração:** o Pagefind faz correspondência por prefixo e
> tolera erros, o que fazia com que uma palavra inventada devolvesse resultados. Foi
> acrescentado um filtro que só aceita um resultado quando alguma palavra realçada
> corresponde mesmo a um termo pesquisado. Ver
> [`docs/qualidade.md`](../docs/qualidade.md#testes-funcionais).

---

## Redireções — IMPLEMENTADO

183 redireções de rota em `src/lib/redirects.mjs` e 191 regras em cada um dos
`public/.htaccess` e `public/_redirects`. Detalhe, números e procedimento de manutenção em
[Redirecionamentos](Redirecionamentos.md).

---

## Verificação

```bash
npm run build
npm run audit:seo
```

`scripts/auditar-seo.mjs` ignora as páginas-stub de redireção e `/admin/`, e verifica
título, descrição, canónico, Open Graph, `lang`, hierarquia de títulos, contagem de JSON-LD
por tipo, presença do `robots.txt` e concordância com o sitemap.

Última execução: **112 páginas analisadas (4 com `noindex`), 0 problemas, 9 avisos**.

Os 9 avisos são títulos acima de 65 caracteres, todos em páginas de eventos cujo nome
oficial é mesmo comprido («12.ª Edição do Fim de Semana Nacional de Amplitude Modulada em
Onda Curta e VHF»). Encurtá-los distorceria o nome que a ARLA publica; ficam como estão. O
guião trata-os como aviso, não como problema, precisamente por isso.

---

## Ao acrescentar uma página

1. Passe `titulo` e `descricao` a `Base.astro` (ou a `Pagina.astro`/`Artigo.astro`, que os
   encaminham). Não deixe a descrição vazia.
2. Se a página tiver um tipo de conteúdo com equivalente em schema.org, construa o bloco
   JSON-LD na página e passe-o em `jsonLd`.
3. Páginas utilitárias (pesquisa, área reservada) levam `semIndexacao`, e, se não devem
   entrar na pesquisa interna, `semPesquisa`.
4. Acrescente as migalhas de pão — geram o `BreadcrumbList` automaticamente.
5. Se a página substituir um endereço antigo, acrescente a redireção nos três ficheiros.
6. `npm run build && npm run audit:seo && npm run lint:links`.
