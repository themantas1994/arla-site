# CMS Decap

O [Decap CMS](https://decapcms.org) dá à direção da ARLA um editor no navegador, em
`/admin/`, que grava **diretamente no repositório Git**: cada gravação é um commit, com
histórico e possibilidade de reverter.

| Ficheiro | O que é |
| --- | --- |
| `public/admin/config.yml` | Toda a configuração: backend, coleções, campos, media |
| `public/admin/index.html` | Página que carrega o Decap CMS a partir de `https://unpkg.com/decap-cms@^3.8.4` |

Esta página é a referência técnica. O guia passo a passo para quem edita está em
[`docs/gestao-de-conteudos.md`](../docs/gestao-de-conteudos.md).

---

## Estado — PARCIALMENTE IMPLEMENTADO

| Parte | Estado |
| --- | --- |
| `config.yml` com todas as coleções e campos | **IMPLEMENTADO** e validado no build |
| Backend local (`npx decap-server`) para desenvolvimento | **IMPLEMENTADO** (`local_backend: true`) |
| Backend GitHub em produção | **PARCIALMENTE IMPLEMENTADO** — configurado no ficheiro, mas depende de uma aplicação OAuth e de um serviço de autenticação que **ainda não existem** |
| Pré-visualização no editor | **Desativada** (`editor: { preview: false }`) nas coleções de dados |
| Fluxo editorial (`publish_mode: editorial_workflow`) | **NÃO IMPLEMENTADO** — não está configurado; cada gravação publica diretamente |

Enquanto a aplicação OAuth e o serviço de autenticação não existirem, o `/admin/` em
produção carrega mas não consegue autenticar. A página `index.html` mostra uma mensagem de
diagnóstico enquanto o CMS não arranca. Ver
[`docs/implantacao.md`](../docs/implantacao.md#configurar-o-editor-de-conteúdos).

---

## Backend

```yaml
backend:
  name: github
  repo: themantas1994/arla-site
  branch: main
  commit_messages:
    create: 'Conteúdo: criar {{collection}} "{{slug}}"'
    update: 'Conteúdo: atualizar {{collection}} "{{slug}}"'
    delete: 'Conteúdo: remover {{collection}} "{{slug}}"'
    uploadMedia: 'Conteúdo: carregar {{path}}'
    deleteMedia: 'Conteúdo: apagar {{path}}'

local_backend: true
```

**`repo` tem de corresponder ao repositório real.** Se a associação passar a alojar o
projeto noutra conta ou organização, este valor muda — e com ele a aplicação OAuth.

> **Atenção: `branch: main` não corresponde a nenhuma branch existente.** A branch
> predefinida deste repositório é hoje `claude/arla-website-redesign-vcemm3`. Com o CMS a
> funcionar em produção, as gravações falhariam. Qual deve ser a branch publicada é uma
> decisão da associação, e por isso ficou registada em
> [`docs/auditoria-do-projeto.md`](../docs/auditoria-do-projeto.md#problemas-encontrados)
> (DOC-020) em vez de ser alterada às cegas.

As mensagens de commit em português tornam o histórico legível: vê-se de imediato o que foi
alteração de conteúdo e o que foi alteração de código.

### Autenticação — o que falta configurar

O Decap escreve pela API do GitHub e precisa que a troca do código de autorização por um
token seja feita **num servidor** — não pode acontecer no navegador. São precisos:

1. **Uma aplicação OAuth do GitHub** (Settings → Developer settings → OAuth Apps), com
   `Homepage URL` a apontar para o sítio e `Authorization callback URL` a apontar para o
   serviço do passo 2. O *Client Secret* **nunca** entra no repositório.
2. **Um serviço de autenticação**, escolhido entre:
   - o **Git Gateway** da Netlify, se o sítio for alojado lá — muda-se o backend para
     `name: git-gateway`;
   - um serviço de OAuth para Decap noutro alojamento (existem implementações pequenas para
     Cloudflare Workers e para funções serverless), acrescentando `base_url` ao `backend`.

**Quem pode editar** é quem tiver acesso de escrita ao repositório no GitHub. Não há contas
nem palavras-passe próprias do sítio: dar acesso é acrescentar a pessoa aos colaboradores
do repositório com permissão *Write*; retirar acesso é removê-la.

### Backend local

`local_backend: true` permite experimentar sem qualquer configuração de OAuth:

```bash
npx decap-server     # num terminal
npm run dev          # noutro
```

Em `http://localhost:4321/admin/`, o Decap grava nos ficheiros locais — vê-se no
`git status`. É a forma de testar alterações ao `config.yml` sem risco.

---

## Media

```yaml
media_folder: public/imagens/conteudo
public_folder: /imagens/conteudo
```

Os carregamentos vão para `public/imagens/conteudo/` e são referenciados como
`/imagens/conteudo/…`. Um ficheiro colocado à mão noutra pasta precisa que o caminho seja
escrito de acordo. Ver [Media e Imagens](Media-e-Imagens.md).

---

## Coleções configuradas

`config.yml` define **9 entradas de menu**, que não são exatamente as 9 coleções do Astro:
quatro são coleções de pastas (`folder`) e cinco são agrupamentos de ficheiros (`files`).

### Coleções de pasta (um ficheiro Markdown por entrada)

| Nome | Rótulo | Pasta | Criar? | Apagar? |
| --- | --- | --- | --- | --- |
| `noticias` | Notícias | `src/content/noticias` | Sim | Sim |
| `tecnica` | Artigos técnicos | `src/content/tecnica` | Sim | Sim |
| `eventos` | Eventos e atividades | `src/content/eventos` | Sim | Sim |
| `paginas` | Páginas de texto | `src/content/paginas` | **Não** (`create: false`) | **Não** (`delete: false`) |

`paginas` está fechada à criação de propósito: acrescentar um ficheiro nessa pasta **não
cria uma rota** — é preciso ligá-lo a partir de uma página. Ver
[Coleções de Conteúdo](Colecoes-de-Conteudo.md#paginas).

Todas usam `slug: '{{slug}}'` (o slug vem do título) e `identifier_field: titulo`.

### Agrupamentos de ficheiros

| Menu | Ficheiros | Coleção Astro? |
| --- | --- | --- |
| **Rede ARLA** | `repetidores.json`, `balizas.json` | Sim |
| **Associação** | `sitio.json`, `orgaos-sociais.json`, `direcao-tecnica.json`, `associados.json`, `cronologia.json` | **Não** — importação direta, sem validação Zod |
| **Recursos** | `documentos.json`, `ligacoes.json`, `faq.json` | Sim |

Os três têm `editor: { preview: false }`: são dados estruturados, para os quais a
pré-visualização do Decap não acrescenta nada.

### Campos reutilizados

O `config.yml` usa âncoras YAML para não repetir definições:

```yaml
_comuns:
  - &titulo { label: Título, name: titulo, widget: string }
  - &resumo  { label: Resumo, name: resumo, widget: text, hint: '…' }
  - &data    { label: Data de publicação, name: data, widget: datetime, … }
  # …
```

As datas usam `date_format: 'DD/MM/YYYY'` (como quem edita as lê), `time_format: false` e
`format: 'YYYY-MM-DD'` (como ficam gravadas). Alterar `format` partiria a compatibilidade
com os ficheiros existentes.

---

## Manter o CMS e o esquema alinhados

**Esta é a principal fonte de erros neste projeto.** O `config.yml` e o
`src/content.config.ts` descrevem os mesmos dados em dois sítios, e nada verifica
automaticamente que concordam.

| Situação | Consequência |
| --- | --- |
| Campo obrigatório no Zod, ausente do CMS | Quem edita cria conteúdo que o build recusa |
| Campo no CMS, ausente do Zod | O campo é gravado no ficheiro e o Astro ignora-o (ou falha, se o esquema for estrito) |
| Opções de `select` diferentes do enum Zod | O CMS aceita um valor que faz falhar o build |

Regra prática: **qualquer alteração a `src/content.config.ts` tem de ser acompanhada da
alteração correspondente em `public/admin/config.yml`**, e vice-versa. Depois, `npm run build`.

Um exemplo real desta divergência: o campo `filtros` dos repetidores está restringido no CMS
a `[vhf, uhf, analogico, digital, dmr, dstar, aprs]`, mas o esquema Zod aceita
`z.array(z.string())` — qualquer valor. Quem editar o JSON à mão não é travado pela
validação.

---

## O que não é editável pelo CMS

| O quê | Onde se altera |
| --- | --- |
| Menu de navegação | `src/lib/navegacao.ts` (`NAVEGACAO`) |
| Textos de interface (botões, rótulos, avisos) | Nos componentes `.astro` |
| Redireções | `src/lib/redirects.mjs` + `public/.htaccess` + `public/_redirects` |
| Páginas estáticas (`/contactos/`, `/rede/aprs/`, `/radioamadorismo/comecar/`…) | Ficheiros `.astro` |
| Perguntas frequentes com HTML complexo | `faq.json` aceita texto; formatação rica exige código |

Dizer à direção que «tudo é editável no CMS» seria incorreto: o conteúdo editorial e os
dados técnicos são; a estrutura do sítio não.

---

## Segurança

- O `config.yml` **não contém segredos**: o *Client ID* da aplicação OAuth vive no serviço
  de autenticação, e o *Client Secret* também.
- `/admin/` está bloqueado no `robots.txt` — o que o mantém fora dos motores de busca, mas
  não é uma fronteira de segurança: a proteção real é o GitHub exigir autenticação.
- O Decap é carregado de `https://unpkg.com` sem *Subresource Integrity*. É o método que a
  documentação oficial recomenda, mas significa confiar no CDN. Ver
  [Segurança](Seguranca.md).
