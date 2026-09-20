# Desenvolvimento Local

---

## Requisitos

- **Node.js ≥ 20.3** (`package.json` → `engines.node`). O desenvolvimento é feito com o
  Node 22, fixado em `.nvmrc`; com `nvm`, basta `nvm use`.
- **npm**. Existe um único `package-lock.json`; não há outro gestor de pacotes configurado.
- Nada mais: sem base de dados, sem Docker, sem serviços externos, sem variáveis de ambiente
  obrigatórias.

```bash
git clone https://github.com/themantas1994/arla-site.git
cd arla-site
nvm use          # opcional, se usar nvm
npm install      # ou npm ci, para instalar exatamente o que está no lock
```

---

## O ciclo habitual

```bash
npm run dev      # http://localhost:4321, com recarga a quente
```

O `astro dev` recarrega componentes, estilos e conteúdo ao gravar. Alterações ao
`astro.config.mjs`, ao `content.config.ts` ou aos ficheiros de `src/data/` usados por
coleções podem exigir reiniciar o servidor.

Para testar o que vai realmente para produção:

```bash
npm run build    # astro build && pagefind --site dist
npm run preview  # serve dist/ em http://localhost:4321
```

### O que só funciona depois do build

| Funcionalidade | Em `npm run dev` | Porquê |
| --- | --- | --- |
| Pesquisa do sítio (`/pesquisa/`) | **Não funciona** | O índice do Pagefind é construído a partir do HTML em `dist/`, no fim do `npm run build` |
| Páginas-stub de redireção | Não são geradas | Só existem na saída do build |
| `npm run lint:links`, `audit:seo` | Não aplicável | Analisam `dist/` |
| `npm run qa`, `audit:desempenho` | Não aplicável | Precisam do sítio servido por `npm run preview` |

A página de pesquisa mostra, em desenvolvimento, uma mensagem a dizer que o índice não está
disponível. É o comportamento esperado.

### Rascunhos

`src/lib/conteudo.ts` filtra as entradas com `rascunho: true` **exceto** em
`import.meta.env.DEV`. Ou seja: um rascunho é visível em `npm run dev` e desaparece no
build de produção. É a forma de pré-visualizar conteúdo por publicar.

---

## Verificações antes de submeter

```bash
npm run check                 # tipos (astro check)
npm run build
npm run preview &             # necessário para qa e audit:desempenho
npm run lint:links            # ligações internas e âncoras no dist/
npm run qa                    # acessibilidade, responsivo e funcional
```

`npm run qa` e `npm run audit:desempenho` abrem um Chromium real através do Playwright. Os
guiões usam o binário em `/opt/pw-browsers/chromium` quando existe (e respeitam a variável
`CHROMIUM_PATH`); caso contrário, o Playwright usa o que tiver instalado.

Detalhe de cada ferramenta: [Testes e Qualidade](Testes-e-Qualidade.md).

---

## Usar o CMS localmente

O `public/admin/config.yml` tem `local_backend: true`, o que permite experimentar o editor
sem qualquer configuração de OAuth:

```bash
npx decap-server     # num terminal
npm run dev          # noutro
```

Depois abra `http://localhost:4321/admin/`. Neste modo, o Decap grava diretamente nos
ficheiros locais — vê-se o resultado no `git status` — em vez de fazer commit no GitHub. É a
melhor forma de testar alterações ao `config.yml` sem risco.

Ver [CMS Decap](CMS-Decap.md).

---

## Aliases de importação

Definidos em `tsconfig.json` e resolvidos pelo Astro:

| Alias | Aponta para |
| --- | --- |
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@layouts/*` | `src/layouts/*` |
| `@lib/*` | `src/lib/*` |
| `@data/*` | `src/data/*` |

```astro
---
import Pagina from '@layouts/Pagina.astro';
import DistintivoEstado from '@components/DistintivoEstado.astro';
import { SITIO, dataExtenso } from '@lib/sitio';
---
```

---

## Publicar noutra origem

```bash
PUBLIC_SITE_URL=https://ensaio.exemplo.pt npm run build
```

Afeta os endereços canónicos, o Open Graph, o sitemap e o RSS. É a única variável de
ambiente do projeto — ver [Variáveis de Ambiente](Variaveis-de-Ambiente.md).

---

## Problemas frequentes em desenvolvimento

| Sintoma | Causa provável |
| --- | --- |
| `[InvalidContentEntryDataError]` | Falta um campo obrigatório, ou um valor de enum é inválido. A mensagem diz a coleção, a entrada e o campo |
| Tipos de coleção desatualizados no editor | Apague `.astro/` e volte a correr `npm run dev`; os tipos são regenerados |
| A pesquisa não devolve nada | Está em `npm run dev`, ou o `pagefind` não correu. Use `npm run build && npm run preview` |
| Uma ligação interna dá 404 | Falta a barra final: o projeto usa `trailingSlash: 'always'` |
| O mapa não carrega telas | A rede local bloqueia `tile.openstreetmap.org`. A lista em texto por baixo do mapa continua a funcionar |

Mais casos: [Resolução de Problemas](Resolucao-de-Problemas.md).
