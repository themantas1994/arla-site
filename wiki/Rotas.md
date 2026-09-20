# Rotas

Encaminhamento por ficheiros, sob `src/pages/`: **41 ficheiros de rota** (40 `.astro` e um
`rss.xml.ts`). Com `trailingSlash: 'always'` e `build.format: 'directory'` em
`astro.config.mjs`, cada rota é servida como `.../index.html` e **todos os endereços
terminam em `/`**.

O build gera **113 páginas HTML reais** (incluindo `/admin/`, `/404.html` e `/500.html`) e
**183 páginas-stub de redireção**, num total de 296 ficheiros HTML em `dist/`. O sitemap
lista 109 endereços.

---

## Tabela de rotas

| Rota | Ficheiro | Fonte de dados |
| --- | --- | --- |
| `/` | `index.astro` | Destaques de `noticias`, `tecnica`, `eventos`, `repetidores`; JSON-LD `WebSite` com `SearchAction` |
| `/arla/` | `arla/index.astro` | Entrada `a-arla` da coleção `paginas` |
| `/arla/historia/` | `arla/historia.astro` | `cronologia.json` (72 entradas) |
| `/arla/quem-somos/` | `arla/quem-somos.astro` | `associados.json` (46 registos), com filtro no cliente |
| `/arla/orgaos-sociais/` | `arla/orgaos-sociais.astro` | `orgaos-sociais.json` |
| `/arla/direcao-tecnica/` | `arla/direcao-tecnica.astro` | `direcao-tecnica.json` |
| `/arla/ser-associado/` | `arla/ser-associado.astro` | Estático + `sitio.json`; JSON-LD `HowTo` |
| `/arla/quotizacao/` | `arla/quotizacao.astro` | `sitio.json` (quota, IBAN, NIB) |
| `/radioamadorismo/` | `radioamadorismo/index.astro` | Estático |
| `/radioamadorismo/comecar/` | `radioamadorismo/comecar.astro` | Estático; JSON-LD `FAQPage` |
| `/radioamadorismo/o-que-e/` | `radioamadorismo/[pagina].astro` | Entrada `o-que-e-o-radioamadorismo` de `paginas` |
| `/radioamadorismo/ser-radioamador/` | `radioamadorismo/[pagina].astro` | Entrada `ser-radioamador` de `paginas` |
| `/radioamadorismo/satelites/` | `radioamadorismo/satelites.astro` | Estático |
| `/radioamadorismo/meteorologia-espacial/` | `radioamadorismo/meteorologia-espacial.astro` | Painéis externos (HamQSL, NOAA), `loading="lazy"` |
| `/tecnica/` | `tecnica/index.astro` | Coleção `tecnica` |
| `/tecnica/[slug]/` | `tecnica/[...slug].astro` | `getStaticPaths()` sobre `tecnica`; 8 páginas; JSON-LD `TechArticle` |
| `/rede/` | `rede/index.astro` | Resumo de `repetidores` e `balizas` |
| `/rede/repetidores/` | `rede/repetidores.astro` | Coleção `repetidores`, via `TabelaRepetidores` |
| `/rede/balizas/` | `rede/balizas.astro` | Coleção `balizas` + mapa |
| `/rede/aprs/` | `rede/aprs.astro` | `repetidores` filtrados por `filtros.includes('aprs')` |
| `/rede/cs5arla/` | `rede/cs5arla.astro` | Estático |
| `/rede/mapa/` | `rede/mapa.astro` | `marcadoresDaRede()` + coordenadas da sede |
| `/noticias/` | `noticias/index.astro` | Coleção `noticias`, primeira página (12 itens) |
| `/noticias/pagina/[n]/` | `noticias/pagina/[pagina].astro` | Páginas 2 em diante; 12 por página |
| `/noticias/categoria/[categoria]/` | `noticias/categoria/[categoria].astro` | Uma página por categoria distinta, via `slugCategoria()` |
| `/noticias/[slug]/` | `noticias/[...slug].astro` | `getStaticPaths()` sobre `noticias`; 39 páginas; JSON-LD `NewsArticle` |
| `/eventos/` | `eventos/index.astro` | `eventosFuturos()` e `eventosPassados()` |
| `/eventos/[slug]/` | `eventos/[...slug].astro` | `getStaticPaths()` sobre `eventos`; 17 páginas; JSON-LD `Event` |
| `/arquivo/` | `arquivo.astro` | Notícias, artigos e eventos por ano, com filtro no cliente |
| `/recursos/` | `recursos/index.astro` | Estático |
| `/recursos/documentos/` | `recursos/documentos.astro` | Coleção `documentos` |
| `/recursos/ligacoes/` | `recursos/ligacoes.astro` | Coleção `ligacoes` |
| `/recursos/faq/` | `recursos/faq.astro` | Coleção `faq`; JSON-LD `FAQPage` |
| `/contactos/` | `contactos.astro` | `sitio.json` + mapa da sede; JSON-LD `ContactPage` |
| `/pesquisa/` | `pesquisa.astro` | Pagefind, no cliente. `semIndexacao` |
| `/legal/aviso-legal/` | `legal/aviso-legal.astro` | Entrada `aviso-legal` de `paginas` |
| `/legal/privacidade/` | `legal/privacidade.astro` | Estático |
| `/legal/cookies/` | `legal/cookies.astro` | Estático |
| `/area-reservada/` | `area-reservada.astro` | Estático. `semIndexacao` e excluída do sitemap |
| `/rss.xml` | `rss.xml.ts` | `noticias` + `tecnica` + `eventos` |
| `/404.html` | `404.astro` | Estático, com pesquisa e atalhos |
| `/500.html` | `500.astro` | Estático; só tem efeito em alojamentos que encaminhem erros 500 para aqui |

---

## Rotas dinâmicas

Quatro ficheiros usam `getStaticPaths()`:

| Ficheiro | Gera | Como |
| --- | --- | --- |
| `noticias/[...slug].astro` | 39 páginas | Uma por entrada; passa também as entradas anterior e seguinte nas props |
| `tecnica/[...slug].astro` | 8 páginas | Idem |
| `eventos/[...slug].astro` | 17 páginas | Idem |
| `noticias/categoria/[categoria].astro` | 9 páginas | Uma por categoria distinta em uso |
| `noticias/pagina/[pagina].astro` | 3 páginas | Da 2 em diante, 12 notícias por página |
| `radioamadorismo/[pagina].astro` | 2 páginas | **Mapa fixo** no próprio ficheiro, não a coleção inteira |

`radioamadorismo/[pagina].astro` é o caso menos óbvio: em vez de gerar uma rota por entrada
de `paginas`, tem um objeto `ROTAS` que liga o segmento de endereço ao `id` da entrada:

```ts
const ROTAS = {
  'o-que-e': { slug: 'o-que-e-o-radioamadorismo', sobretitulo: 'Radioamadorismo' },
  'ser-radioamador': { slug: 'ser-radioamador', sobretitulo: 'Radioamadorismo' },
};
```

**Acrescentar um ficheiro a `src/content/paginas/` não cria uma rota.** É preciso acrescentar
a entrada a este mapa (e ao array de `getStaticPaths()`, que hoje repete as mesmas chaves),
ou criar uma página própria, como acontece com `a-arla.md` e `aviso-legal.md`.

---

## Páginas-stub de redireção

A configuração `redirects` do `astro.config.mjs` gera 183 páginas HTML com `meta refresh` e
`<link rel="canonical">` — uma por redireção de rota. São elas que explicam a diferença
entre 113 páginas reais e 296 ficheiros HTML no `dist/`, e os avisos «has no `<html>`
element» que o Pagefind emite durante o build.

No alojamento Apache atual, estas páginas quase nunca chegam a ser servidas: o `.htaccess`
responde 301 antes. Ver [Redirecionamentos](Redirecionamentos.md).

---

## Acrescentar uma rota

- **Página estática:** criar um `.astro` sob `src/pages/`, no caminho desejado. Fica
  disponível de imediato.
- **Listagem + detalhe a partir de uma coleção:** seguir o padrão de
  `noticias`/`tecnica`/`eventos` — um `index.astro` para a listagem e um `[...slug].astro`
  com `getStaticPaths()` para o detalhe.
- **Entrada no menu:** acrescentar a `NAVEGACAO`, em `src/lib/navegacao.ts`. **Uma rota não
  aparece na navegação só por existir** — `NAVEGACAO` é a única fonte de verdade do menu, e
  `estaAtivo()` determina o realce do item atual.
- **Se substituir um endereço antigo:** acrescentar a redireção nos três ficheiros.
- **Depois:** `npm run build && npm run lint:links && npm run audit:seo`.
