# Estrutura do Projeto

O que cada diretório e cada ficheiro faz, e o que se deve ou não alterar à mão.

---

## Raiz

| Ficheiro | Para que serve | Alterar? |
| --- | --- | --- |
| `package.json` | Dependências, `scripts` e `engines.node` (`>=20.3.0`) | Sim, com cuidado |
| `package-lock.json` | Árvore exata de dependências | **Gerado.** Só através do `npm` |
| `.nvmrc` | Versão de Node usada em desenvolvimento (`22`) | Sim |
| `astro.config.mjs` | Configuração do Astro: `site`, `trailingSlash`, `redirects`, sitemap, Markdown, Vite | Sim |
| `tsconfig.json` | `astro/tsconfigs/strict` + os aliases `@/`, `@components/`, `@layouts/`, `@lib/`, `@data/` | Sim |
| `.gitignore` | Ignora `node_modules/`, `dist/`, `.astro/`, `.env*`, `reports/` | Sim |
| `README.md` | Ponto de entrada para quem desenvolve | Sim |

Não existe `LICENSE`, nem `.github/`, nem configuração de ESLint ou Prettier.

---

## `src/`

### `src/content.config.ts`

Define as **9 coleções** e os respetivos esquemas Zod. É o contrato entre quem edita
conteúdo e quem escreve código: acrescentar um campo a um tipo de conteúdo começa aqui.
Detalhe em [Coleções de Conteúdo](Colecoes-de-Conteudo.md).

### `src/content/` — conteúdo editorial em Markdown

| Diretório | Coleção | Quantidade |
| --- | --- | --- |
| `noticias/` | `noticias` | 39 ficheiros |
| `tecnica/` | `tecnica` | 8 ficheiros |
| `eventos/` | `eventos` | 17 ficheiros |
| `paginas/` | `paginas` | 4 ficheiros |

O nome do ficheiro é o slug do endereço. Não renomeie um ficheiro sem acrescentar a
redireção correspondente — ver [Redirecionamentos](Redirecionamentos.md).

### `src/data/` — dados estruturados em JSON

| Ficheiro | Usado como | Onde aparece |
| --- | --- | --- |
| `repetidores.json` | Coleção `repetidores` (9 registos) | `/rede/repetidores/`, `/rede/mapa/`, `/rede/aprs/`, página inicial |
| `balizas.json` | Coleção `balizas` (4 registos) | `/rede/balizas/`, `/rede/mapa/` |
| `documentos.json` | Coleção `documentos` (3 registos) | `/recursos/documentos/` |
| `ligacoes.json` | Coleção `ligacoes` | `/recursos/ligacoes/` |
| `faq.json` | Coleção `faq` | `/recursos/faq/` (com JSON-LD `FAQPage`) |
| `sitio.json` | Importação direta (`src/lib/sitio.ts`) | Todo o sítio: rodapé, contactos, quotização, JSON-LD |
| `orgaos-sociais.json` | Importação direta | `/arla/orgaos-sociais/` |
| `direcao-tecnica.json` | Importação direta | `/arla/direcao-tecnica/` |
| `associados.json` | Importação direta | `/arla/quem-somos/` |
| `cronologia.json` | Importação direta | `/arla/historia/` |

Todos guardam a lista dentro de uma chave (`{ "repetidores": [...] }`) em vez de um array na
raiz, porque o Decap CMS não consegue editar um JSON cuja raiz seja um array.

### `src/lib/` — lógica partilhada

| Ficheiro | O que exporta |
| --- | --- |
| `conteudo.ts` | `noticias()`, `tecnica()`, `eventos()`, `eventosFuturos()`, `eventosPassados()`, `slugCategoria()`, `relacionados()`, `textoSimples()`. Exclui rascunhos em produção e ordena por data |
| `sitio.ts` | `SITIO` (de `sitio.json`), `email()`, `emailVisivel()`, `moradaLinhas`, `dataExtenso()`, `dataCurta()`, `iso()`, `intervaloDatas()`, `tempoLeitura()`, `normalizar()`, `estadoEvento()`, `ROTULO_ESTADO_EVENTO` |
| `navegacao.ts` | `NAVEGACAO` (a **única fonte de verdade** do menu) e `estaAtivo()` |
| `maidenhead.ts` | `quadriculaParaCoordenadas()` (devolve o centro da quadrícula e uma `precisaoKm`) e `formatarCoordenadas()` |
| `rede.ts` | `marcadoresDaRede()` — converte repetidores e balizas em marcadores para `Mapa.astro` |
| `redirects.mjs` | `redirects` — 183 redireções de rota, importadas por `astro.config.mjs`. **Ficheiro `.mjs`, não `.ts`**, porque é lido pela configuração do Astro em Node |

### `src/components/` — 19 componentes, todos em uso

Catálogo em [Componentes](Componentes.md).

### `src/layouts/`

`Base.astro` (documento HTML e metadados), `Pagina.astro` (páginas de texto e de secção),
`Artigo.astro` (notícias e artigos técnicos).

### `src/pages/` — 41 ficheiros de rota

40 `.astro` e um `rss.xml.ts`. Tabela completa em [Rotas](Rotas.md).

### `src/styles/global.css`

507 linhas: `@layer reset, tokens, base, components, utilities`, tokens de design, tema
claro e escuro, estilos de base e de impressão. Importado uma vez, a partir de `Base.astro`.
Referência em [Sistema de Design](Sistema-de-Design.md).

---

## `public/`

Tudo o que está aqui é copiado tal e qual para `dist/`.

| Caminho | O que é | Alterar? |
| --- | --- | --- |
| `admin/config.yml` | Configuração do Decap CMS: backend, coleções, campos | Sim — ver [CMS Decap](CMS-Decap.md) |
| `admin/index.html` | Carrega o Decap do unpkg, com versão fixa e Subresource Integrity | Raramente |
| `documentos/` | PDF da associação (estatutos, regulamentos, ficha de inscrição) | Pelo CMS ou à mão |
| `imagens/` | Logótipos e ícones |  |
| `imagens/conteudo/` | Media migrada do sítio anterior e carregamentos do CMS | Pelo CMS |
| `.htaccess` | 191 regras 301, cabeçalhos de segurança, cache e CSP (Apache) | **Gerado** — `npm run redirecoes:gerar` |
| `_redirects` | As mesmas 191 regras, formato Netlify/Cloudflare Pages | **Gerado** — `npm run redirecoes:gerar` |
| `manifest.webmanifest` | Manifesto da aplicação Web | Sim |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Ícones | Sim |

**Atenção:** o bloco de redireções do `.htaccess` e todo o `_redirects` são **gerados** a
partir de `src/lib/redirects.mjs` por `npm run redirecoes:gerar`, e não devem ser editados
à mão. O resto do `.htaccess` — cabeçalhos de segurança, cache, Content-Security-Policy e
`ErrorDocument` — é mantido à mão e o gerador não lhe toca.
`npm run redirecoes:validar` falha se divergirem. Ver
[Redirecionamentos](Redirecionamentos.md).

O `robots.txt` **já não está em `public/`**: passou a ser gerado no build por
`src/pages/robots.txt.ts`, para o endereço do sitemap acompanhar `PUBLIC_SITE_URL`
(auditoria: DOC-017). Ver [SEO](SEO.md).

---

## `scripts/`

Guiões Node.js (ESM). Nenhum é necessário para produzir o sítio — `npm run build` não os
invoca.

| Guião | Comando | Entrada | Saída | Altera ficheiros? |
| --- | --- | --- | --- | --- |
| `qa.mjs` | `npm run qa` | Sítio servido em `http://localhost:4321` | `reports/qa.json` (+ capturas com `--capturas`) | Só em `reports/` |
| `capturas.mjs` | `npm run qa:capturas` | Idem | `reports/capturas/*.png` | Só em `reports/` |
| `check-links.mjs` | `npm run lint:links` | `dist/` | Consola (+ JSON com `--json`) | Não |
| `auditar-seo.mjs` | `npm run audit:seo` | `dist/` | Consola (+ JSON com `--json`) | Não |
| `auditar-desempenho.mjs` | `npm run audit:desempenho` | Sítio servido localmente | Consola (+ JSON com `--json <ficheiro>`) | Só se lhe der `--json` |
| `otimizar-media.mjs` | `node scripts/otimizar-media.mjs [dir]` | `public/imagens/conteudo` por predefinição | As mesmas imagens, redimensionadas | **Sim — reescreve imagens** |
| `regenerar-resumos.mjs` | `node scripts/regenerar-resumos.mjs [--escrever]` | `src/content/**/*.md` | Pré-visualização; grava com `--escrever` | **Sim, com `--escrever`** |

Os dois últimos **não têm entrada em `package.json`** e destinam-se a ser executados à mão,
sobre um lote de conteúdo migrado. Detalhe em
[Testes e Qualidade](Testes-e-Qualidade.md) e [Media e Imagens](Media-e-Imagens.md).

---

## `docs/` e `wiki/`

- `docs/` — português, dirigida à direção da associação e a quem mantém o projeto:
  [arquitetura e decisões](../docs/arquitetura.md),
  [gestão de conteúdos](../docs/gestao-de-conteudos.md),
  [implantação](../docs/implantacao.md),
  [resultados de qualidade](../docs/qualidade.md),
  [mapa de redireções](../docs/mapa-de-redirecoes.md),
  [inventário da migração](../docs/inventario-de-conteudos.md),
  [conteúdo por verificar](../docs/carece-de-verificacao.md),
  [auditoria do projeto](../docs/auditoria-do-projeto.md).
- `wiki/` — esta Wiki técnica.

---

## Gerado, não versionado

Criado pelo build e ignorado pelo Git: `dist/` (saída do build, incluindo
`dist/pagefind/`), `.astro/` (tipos gerados das coleções), `node_modules/` e `reports/`
(relatórios de QA e capturas). Nada nestes diretórios deve ser editado à mão.
