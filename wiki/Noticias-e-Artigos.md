# Notícias e Artigos

Duas coleções com o mesmo esquema de base e o mesmo layout, separadas porque cumprem papéis
diferentes: `noticias` é atualidade, `tecnica` é referência.

| | `noticias` | `tecnica` |
| --- | --- | --- |
| Diretório | `src/content/noticias/` (39) | `src/content/tecnica/` (8) |
| Listagem | `/noticias/` + `/noticias/pagina/[n]/` | `/tecnica/` |
| Detalhe | `/noticias/[slug]/` | `/tecnica/[slug]/` |
| Por categoria | `/noticias/categoria/[categoria]/` | — |
| Campos extra | nenhum | `indice`, `nivel`, `referencias` |
| JSON-LD | `NewsArticle` | `TechArticle` |

---

## Frontmatter

Campos comuns (`baseArtigo` em `src/content.config.ts`), com o detalhe em
[Coleções de Conteúdo](Colecoes-de-Conteudo.md#campos-comuns-ao-conteúdo-editorial):

```markdown
---
titulo: "Título da notícia"
resumo: "Uma ou duas frases — cartões, pesquisa, Open Graph e RSS."
data: "2026-09-20"
atualizado: "2026-09-25"        # opcional
autor: "Nome Apelido"           # opcional
indicativo: "CT1ABC"            # opcional
imagem: "/imagens/conteudo/ficheiro.jpg"   # opcional
imagemAlt: "Descrição da imagem"           # obrigatório se houver imagem
categoria: "Associação"
etiquetas: ["repetidores", "arrábida"]
historico: false
notaHistorica: ""               # texto do aviso, se historico: true
urlAntigo: "/site/…/"           # não alterar
destaque: false
rascunho: false
---

Corpo do artigo em Markdown.
```

Os artigos técnicos acrescentam:

```markdown
indice: true                    # mostrar índice de conteúdos
nivel: intermedio               # introducao | intermedio | avancado
referencias:
  - { titulo: "AMSAT-DL", url: "https://www.amsat-dl.org/" }
```

---

## Rotas e slugs — IMPLEMENTADO

`src/pages/noticias/[...slug].astro` e `src/pages/tecnica/[...slug].astro` usam
`getStaticPaths()` sobre a coleção. **O slug é o nome do ficheiro**, sem `.md`:

```text
src/content/noticias/5-ciclo-raid.md   →   /noticias/5-ciclo-raid/
src/content/tecnica/qo-100-kg-stv.md   →   /tecnica/qo-100-kg-stv/
```

**Renomear um ficheiro muda o endereço.** Se o endereço já foi publicado, acrescente a
redireção correspondente — ver [Redirecionamentos](Redirecionamentos.md).

`getStaticPaths()` passa, além da entrada, as entradas **anterior** e **seguinte** na ordem
cronológica, usadas nas ligações de navegação sequencial no fim do artigo.

---

## Ordenação, paginação e rascunhos — IMPLEMENTADO

`src/lib/conteudo.ts`:

- `noticias()` e `tecnica()` devolvem tudo ordenado por `data` **decrescente**;
- ambas filtram por `publicado`, que exclui `rascunho: true` — **exceto** em
  `import.meta.env.DEV`, pelo que um rascunho é visível em `npm run dev` e desaparece no
  build de produção.

A paginação das notícias usa 12 por página. A primeira página vive em `/noticias/`; as
seguintes em `/noticias/pagina/2/`, `/3/`, `/4/`.

> **Dívida técnica conhecida.** Em `src/pages/noticias/pagina/[pagina].astro`, o valor 12
> aparece duas vezes: na constante `POR_PAGINA` e literalmente dentro de `getStaticPaths()`.
> Alterar só uma delas gera páginas a mais ou a menos. Ver
> [`docs/auditoria-do-projeto.md`](../docs/auditoria-do-projeto.md#dívida-técnica).

---

## Categorias e etiquetas — IMPLEMENTADO

`categoria` é texto livre com predefinição `'Geral'`; o CMS oferece uma lista de sugestões
por coleção, com `create: true` (quem edita pode escrever uma nova).

`slugCategoria()` em `src/lib/conteudo.ts` converte a categoria em segmento de endereço
(`normalizar()` remove acentos e passa a minúsculas, e o resto vira hífenes):

```text
"Rede ARLA"  →  rede-arla   →  /noticias/categoria/rede-arla/
```

`src/pages/noticias/categoria/[categoria].astro` gera uma página por categoria distinta.
**Uma categoria nova cria automaticamente um endereço novo** — o que também quer dizer que
corrigir a ortografia de uma categoria muda o endereço da página dessa categoria.

`etiquetas` é um array de texto livre, usado sobretudo no cálculo de conteúdo relacionado.

---

## Conteúdo relacionado — IMPLEMENTADO

`relacionados(atual, candidatos, quantos = 3)` pontua cada candidato:

```text
pontos = (etiquetas em comum × 2) + (mesma categoria ? 1 : 0)
```

Ordena por pontuação decrescente, exclui o próprio artigo e, se não houver candidatos
pontuados que cheguem, completa com os mais recentes. A comparação passa por `normalizar()`,
pelo que acentos e maiúsculas não contam.

---

## Conteúdo histórico — IMPLEMENTADO

**Nada é arquivado automaticamente.** O conteúdo datado é marcado à mão:

- `historico: true` → a listagem mostra a etiqueta «Conteúdo de arquivo» e a página do
  artigo mostra um aviso de contexto temporal;
- `notaHistorica` → o texto desse aviso (por exemplo, explicar que a legislação referida foi
  entretanto alterada). Sem ela, é usado um texto genérico com a data.

O artigo continua publicado, ligável e pesquisável. Esta é a política editorial do projeto:
preservar o registo do que a associação publicou, assinalando o contexto — não reescrever
nem apagar. As ligações externas mortas dentro de artigos migrados são deixadas como estão,
pela mesma razão; ver [`docs/qualidade.md`](../docs/qualidade.md#ligações).

---

## Layout do artigo — IMPLEMENTADO

`src/layouts/Artigo.astro` é partilhado por notícias, artigos técnicos e eventos. Trata de:

- migalhas de pão (com JSON-LD `BreadcrumbList`), categoria e etiqueta de arquivo;
- autoria, data por extenso e **tempo de leitura** — `tempoLeitura()` conta as palavras do
  texto simples a 200 palavras por minuto, com o mínimo de 1;
- índice de conteúdos, **apenas quando há pelo menos 3 títulos de nível 2 ou 3** e a entrada
  pede `indice`. Sem índice, o artigo é centrado em vez de deixar meia coluna vazia;
- imagem principal com `imagemAlt`;
- aviso de conteúdo histórico;
- botões de partilha e de impressão;
- navegação anterior/seguinte e cartões de conteúdo relacionado.

`textoSimples()` limpa o Markdown (blocos de código, imagens, ligações, HTML) para contar
palavras — não é usado para apresentar texto.

> **Dívida técnica conhecida.** `Artigo.astro` declara uma prop `tipoArtigo`
> (`'noticia' | 'tecnica' | 'evento'`) que **nunca é lida** — o `astro check` assinala-a.
> As três páginas de detalhe passam-na, sem efeito. Ou passa a ser usada, ou deve ser
> removida das quatro.

---

## SEO e dados estruturados — IMPLEMENTADO

Cada página de artigo emite JSON-LD construído na própria página:

- **Notícias:** `NewsArticle`, com `headline`, `description`, `datePublished`,
  `dateModified` (usa `atualizado` ou, na sua falta, `data`), `inLanguage: 'pt-PT'`,
  `articleSection`, `keywords`, `image` (quando existe), `author` (`Person` com nome e
  indicativo, ou a `Organization` quando não há autor), `publisher` a referenciar
  `/#organizacao` e `mainEntityOfPage`.
- **Artigos técnicos:** `TechArticle`, com a mesma estrutura.

Os metadados `<title>`, descrição, canónico, Open Graph e Twitter Card são construídos em
`Base.astro` a partir de `titulo` e `resumo`. A descrição é truncada a ~160 caracteres para
os motores de busca; o resumo completo continua a ser usado nos cartões e na pesquisa.

Todos os artigos entram no feed RSS (`src/pages/rss.xml.ts`), juntamente com os eventos.

---

## Publicar uma notícia

### Pelo CMS

`/admin/` → **Notícias → New Notícia** → preencher → **Publish**. Produz exatamente o mesmo
ficheiro Markdown. O guia para a direção está em
[`docs/gestao-de-conteudos.md`](../docs/gestao-de-conteudos.md).

### Diretamente em Git

1. Criar `src/content/noticias/nome-do-artigo.md` — o nome do ficheiro passa a ser o slug:
   minúsculas, sem acentos, com hífenes.
2. Escrever o frontmatter (ver acima) e o corpo em Markdown.
3. Colocar as imagens em `public/imagens/conteudo/` e referenciá-las por caminho absoluto.
4. `npm run check && npm run build` — se faltar um campo obrigatório, o build falha a
   indicar o ficheiro e o campo.
5. `npm run preview` e `npm run lint:links`, para confirmar que as ligações do artigo
   resolvem.

### Publicar um artigo técnico

Igual, em `src/content/tecnica/`, acrescentando `nivel` e, se aplicável, `referencias`. Use
títulos `##` e `###` para que o índice de conteúdos tenha material — abaixo de três títulos,
o índice não é mostrado.
