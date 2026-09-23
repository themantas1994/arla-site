# CMS Decap

O [Decap CMS](https://decapcms.org) dá à direção da ARLA um editor no navegador, em
`/admin/`, que grava **diretamente no repositório Git**: cada gravação é um commit, com
histórico e possibilidade de reverter.

| Ficheiro | O que é |
| --- | --- |
| `public/admin/config.yml` | Toda a configuração: backend, coleções, campos, media |
| `public/admin/index.html` | Página que carrega o Decap CMS de `https://unpkg.com/decap-cms@3.16.2` — versão fixa, com `integrity` e `crossorigin` |

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

> ⚠ **`branch: main` não corresponde a nenhuma branch existente.** A branch predefinida
> deste repositório é hoje `claude/arla-website-redesign-vcemm3`. Com o CMS a funcionar em
> produção, as gravações **falhariam**.
>
> Qual deve ser a branch publicada é uma decisão da associação, e por isso **não foi
> alterada** — nem pela auditoria (DOC-020), nem pela remediação. As duas vias possíveis,
> e o que muda em cada uma, estão em
> [`docs/decisoes-pendentes.md`](../docs/decisoes-pendentes.md#1-qual-é-a-branch-publicada-do-sítio).
>
> `npm run validar:esquemas` avisa em todas as execuções enquanto a branch indicada não
> existir no repositório, para a pendência não se perder de vista.

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

O `config.yml` e o `src/content.config.ts` descrevem os mesmos dados em dois sítios. Era a
principal fonte de erros do projeto; desde a remediação da auditoria (DT-002), há
verificação automática:

```bash
npm run validar:esquemas
```

Corre também em integração contínua. Compara as 9 coleções e **falha** quando encontra:

| Situação | Consequência que evita |
| --- | --- |
| Campo obrigatório no Zod, ausente do CMS | Quem edita cria conteúdo que o build recusa |
| Campo obrigatório no Zod, opcional no CMS | O build falha se o campo ficar vazio |
| Campo no CMS, ausente do Zod | O campo é gravado no ficheiro e o Astro ignora-o |
| Opção de `select` fora do `z.enum()` | O CMS aceita um valor que faz falhar o build |
| Coleção do CMS sem coleção de conteúdo | Gravações num sítio que o build não lê |
| `media_folder`/`public_folder` alterados | Imagens carregadas pelo CMS deixam de aparecer |

**Avisa** (sem falhar) quando o esquema aceita um campo que o CMS não oferece — hoje,
`anexos` nas três coleções editoriais e, nos eventos, `atualizado`, `autor`, `indicativo`,
`historico`, `notaHistorica` e `destaque`. São campos que o Astro aceita e o editor não
expõe: não partem nada, mas não estão ao alcance de quem edita.

Regra prática: **qualquer alteração a `src/content.config.ts` tem de ser acompanhada da
alteração correspondente em `public/admin/config.yml`**, e vice-versa. O guião diz qual
falta.

Uma divergência que o guião não apanha, por não ser apanhável: o campo `filtros` dos
repetidores está restringido no CMS a `[vhf, uhf, analogico, digital, dmr, dstar, aprs]`,
mas o esquema Zod aceita `z.array(z.string())` — qualquer valor. O CMS é aqui mais
restritivo do que o esquema, o que é seguro; mas quem editar o JSON à mão não é travado
pela validação, e um filtro mal escrito faz o repetidor desaparecer ao filtrar, sem erro.

---

## O que não é editável pelo CMS

| O quê | Onde se altera |
| --- | --- |
| Menu de navegação | `src/lib/navegacao.ts` (`NAVEGACAO`) |
| Textos de interface (botões, rótulos, avisos) | Nos componentes `.astro` |
| Redireções | `src/lib/redirects.mjs` (fonte única) + `npm run redirecoes:gerar` |
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
- O Decap é carregado de `https://unpkg.com` **com versão fixa e *Subresource Integrity***
  (`decap-cms@3.16.2` + `integrity` + `crossorigin`). Antes era um intervalo `^3.8.4` sem
  `integrity`: o CDN escolhia a versão e um ficheiro trocado passaria sem ninguém dar por
  isso. Ao atualizar, mude a versão e o hash ao mesmo tempo — o comando está em comentário
  no próprio `index.html`. Ver [Segurança](Seguranca.md).
- A página de diagnóstico de `index.html` só desaparece quando o CMS arranca mesmo. Se o
  `integrity` não corresponder, o navegador recusa o ficheiro e a mensagem fica visível, em
  vez de a página ficar em branco.
