# Coleções de Conteúdo

Todas as coleções e esquemas estão definidos num único ficheiro,
[`src/content.config.ts`](../src/content.config.ts). Esta página descreve o que lá está,
campo a campo. Quando houver dúvida, o ficheiro é a fonte de verdade — esta página é a sua
leitura comentada.

São **9 coleções**: quatro em Markdown (`glob`) e cinco em JSON (`file`).

---

## Como os ficheiros JSON são carregados

O Decap CMS não consegue editar um ficheiro JSON cuja raiz seja um array. Por isso todos os
ficheiros de dados guardam a lista dentro de uma chave, e o `content.config.ts` desembrulha-a
com este parser:

```ts
const listaEm = (chave: string) => (texto: string) => {
  const dados = JSON.parse(texto);
  return Array.isArray(dados) ? dados : (dados[chave] ?? []);
};
```

Ou seja, `repetidores.json` tem esta forma:

```json
{ "repetidores": [ { "id": "cq0vstc", "…": "…" } ] }
```

---

## Campos comuns ao conteúdo editorial

`baseArtigo` é partilhado por `noticias`, `tecnica` e `eventos`:

| Campo | Tipo | Obrigatório | Predefinição | Notas |
| --- | --- | --- | --- | --- |
| `titulo` | `string` | Sim | — | |
| `resumo` | `string` | Sim | — | Usado nos cartões, na pesquisa, no Open Graph e no RSS |
| `data` | `date` | Sim | — | Data de publicação; determina a ordenação |
| `atualizado` | `date` | Não | — | |
| `autor` | `string` | Não | — | |
| `indicativo` | `string` | Não | — | Indicativo de quem escreve |
| `imagem` | `string` | Não | — | Caminho absoluto, ex.: `/imagens/conteudo/ct1fbf.jpg` |
| `imagemAlt` | `string` | Não | — | Descrição acessível. Obrigatória na prática sempre que houver imagem |
| `categoria` | `string` | Não | `'Geral'` | Texto livre; o CMS sugere uma lista por coleção |
| `etiquetas` | `string[]` | Não | `[]` | Usadas no cálculo de conteúdo relacionado |
| `historico` | `boolean` | Não | `false` | Mostra o aviso de contexto temporal |
| `notaHistorica` | `string` | Não | — | Texto desse aviso |
| `urlAntigo` | `string` | Não | — | Endereço no WordPress. Não alterar: serve o histórico das redireções |
| `destaque` | `boolean` | Não | `false` | Destaque na página inicial |
| `rascunho` | `boolean` | Não | `false` | Visível em `npm run dev`, excluído do build de produção |
| `anexos` | `{ nome, ficheiro, tipo? }[]` | Não | `[]` | |

---

## `noticias`

- **Fonte:** `src/content/noticias/**/*.md` (39 ficheiros), carregador `glob`.
- **Esquema:** exatamente `baseArtigo`, sem campos adicionais.
- **Rotas:** `/noticias/`, `/noticias/pagina/[n]/` (12 por página),
  `/noticias/categoria/[categoria]/`, `/noticias/[slug]/`.
- **Ordenação:** `data` decrescente (`noticias()` em `src/lib/conteudo.ts`).

Ver [Notícias e Artigos](Noticias-e-Artigos.md).

## `tecnica`

- **Fonte:** `src/content/tecnica/**/*.md` (8 ficheiros).
- **Esquema:** `baseArtigo`, mais:

| Campo | Tipo | Predefinição | Notas |
| --- | --- | --- | --- |
| `indice` | `boolean` | `true` | Mostrar índice de conteúdos |
| `nivel` | `'introducao' \| 'intermedio' \| 'avancado'` | `'intermedio'` | |
| `referencias` | `{ titulo, url }[]` | `[]` | Bibliografia do artigo |

- **Rotas:** `/tecnica/` e `/tecnica/[slug]/`.
- **Dados estruturados:** JSON-LD `TechArticle`.

## `eventos`

- **Fonte:** `src/content/eventos/**/*.md` (17 ficheiros).
- **Esquema:** `baseArtigo`, mais:

| Campo | Tipo | Obrigatório | Predefinição |
| --- | --- | --- | --- |
| `inicio` | `date` | **Sim** | — |
| `fim` | `date` | Não | — |
| `dataTexto` | `string` | Não | — |
| `horaInicio`, `horaFim` | `string` | Não | — |
| `local` | `string` | Não | — |
| `coordenadas` | `{ lat: number, lon: number }` | Não | — |
| `organizador` | `string` | Não | — |
| `inscricoes` | `string` | Não | — |
| `ligacaoExterna` | `string` | Não | — |
| `tipo` | `'atividade' \| 'workshop' \| 'concurso' \| 'encontro' \| 'divulgacao'` | Não | `'atividade'` |
| `cancelado` | `boolean` | Não | `false` |

Nota: `data` (de `baseArtigo`) continua obrigatória nos eventos, além de `inicio`.

- **Rotas:** `/eventos/` e `/eventos/[slug]/`.
- **Dados estruturados:** JSON-LD `Event`.

Ver [Eventos](Eventos.md).

## `paginas`

- **Fonte:** `src/content/paginas/**/*.md` (4 ficheiros).
- **Esquema próprio**, mais curto: `titulo` e `resumo` obrigatórios; `atualizado`, `autor`,
  `indicativo`, `urlAntigo` opcionais; `indice` com predefinição `false`. **Não tem** `data`,
  `categoria`, `etiquetas`, `historico`, `destaque`, `rascunho` nem `anexos`.
- **Rotas:** estas páginas não têm rota própria automática — são consumidas por páginas
  específicas:

| Ficheiro | Apresentado em |
| --- | --- |
| `o-que-e-o-radioamadorismo.md` | `/radioamadorismo/o-que-e/` (via `[pagina].astro`) |
| `ser-radioamador.md` | `/radioamadorismo/ser-radioamador/` (via `[pagina].astro`) |
| `a-arla.md` | `/arla/` |
| `aviso-legal.md` | `/legal/aviso-legal/` |

O mapa `ROTAS` em `src/pages/radioamadorismo/[pagina].astro` liga o segmento de endereço ao
`id` da entrada. **Acrescentar um ficheiro a `src/content/paginas/` não cria uma rota**:
é preciso ligá-lo a partir de uma página.

---

## Coleções de dados (JSON)

### `repetidores`

`src/data/repetidores.json`, 9 registos. Esquema completo e comportamento em
[Sistema de Repetidores](Sistema-de-Repetidores.md).

| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| `id` | `string` | Sim |
| `canal` | `string` | Não |
| `banda` | `'VHF' \| 'UHF' \| 'SHF' \| 'HF'` | Sim |
| `modo` | `string` | Sim |
| `filtros` | `string[]` (predefinição `[]`) | Não |
| `localizacao` | `string` | Sim |
| `quadricula` | `string` | Não |
| `coordenadas` | `{ lat, lon }` | Não |
| `frequenciaTx`, `frequenciaRx` | `string` | Sim |
| `tom`, `acesso`, `potencia` | `string` | Não |
| `indicativo` | `string` | Sim |
| `estado` | `'operacional' \| 'manutencao' \| 'indisponivel' \| 'desconhecido'` | Sim |
| `notas` | `string` | Não |

As frequências são **`string`, não `number`**, de propósito: preserva os zeros finais
(`145.7000`) tal como a ARLA os publica.

### `balizas`

`src/data/balizas.json`, 4 registos. Difere dos repetidores: tem `frequencia` (uma só) e
`antena`, e **não tem** `canal`, `acesso`, `tom` nem `filtros`. `banda` é texto livre
(ex.: `"VHF 144 MHz"`), não um enum. Ver [Balizas e Rede](Balizas-e-Rede.md).

### `documentos`

`src/data/documentos.json`, 3 registos.

| Campo | Tipo | Obrigatório | Predefinição |
| --- | --- | --- | --- |
| `id`, `nome`, `categoria`, `ficheiro` | `string` | Sim | — |
| `descricao`, `tamanho` | `string` | Não | — |
| `tipo` | `string` | Não | `'PDF'` |
| `data` | `date` | Não | — |
| `externo` | `boolean` | Não | `false` |

`ficheiro` é um caminho absoluto a partir de `public/`, ex.: `/documentos/estatutos-arla.pdf`.
`tamanho` é texto escrito à mão (`"109 KB"`) e **não é calculado** — mostrado no botão de
descarga para quem está com dados móveis limitados.

### `ligacoes`

`src/data/ligacoes.json`, 8 registos: `id`, `nome`, `url` e `categoria` obrigatórios,
`descricao` opcional.

### `faq`

`src/data/faq.json`, 8 registos: `id`, `pergunta` e `resposta` obrigatórios; `categoria`
com predefinição `'Geral'`. Alimenta o JSON-LD `FAQPage` em `/recursos/faq/`.

---

## Dados fora das coleções

Cinco ficheiros de `src/data/` **não são coleções** e são importados diretamente pelas
páginas. Consequência importante: **não há validação de esquema Zod sobre eles**. Um campo
mal escrito aqui não faz falhar o build da mesma forma — pode simplesmente aparecer como
`undefined` na página.

| Ficheiro | Estrutura | Consumido por |
| --- | --- | --- |
| `sitio.json` | Objeto: nome, morada, coordenadas, `email` (em duas partes), `quotaAnual`, `iban`, `nib`, `redes`, `areaGeografica` | `src/lib/sitio.ts` → todo o sítio |
| `orgaos-sociais.json` | `mandato`, `notaMandato`, `orgaos[]` com `membros[]` | `/arla/orgaos-sociais/` |
| `direcao-tecnica.json` | `areas[]` com `responsaveis[]` | `/arla/direcao-tecnica/` |
| `associados.json` | `nota`, `associados[]` (46 registos) | `/arla/quem-somos/` |
| `cronologia.json` | `introducao`, `nota`, `emAtualizacao`, `entradas[]` (72 registos) | `/arla/historia/` |

Todos continuam editáveis pelo CMS (secção **Associação**), com os campos definidos em
`public/admin/config.yml`.

---

## Acrescentar um campo a uma coleção

1. **Esquema:** acrescente o campo em `src/content.config.ts`. Se for obrigatório, todos os
   ficheiros existentes têm de o ter — dê-lhe uma predefinição, ou preencha-os antes.
2. **CMS:** acrescente o campo correspondente em `public/admin/config.yml`, na coleção certa,
   com `label` em português e `required: false` quando for opcional. Os dois ficheiros têm de
   concordar: um campo obrigatório no Zod e ausente do CMS dá conteúdo que o CMS grava e o
   build recusa.
3. **Apresentação:** use-o nos componentes ou páginas.
4. **Verificar:** `npm run check` e `npm run build`.
5. **Documentar:** atualize esta página e a página específica da coleção.

## Acrescentar uma coleção nova

1. `defineCollection()` em `src/content.config.ts`, com o carregador certo (`glob` para
   Markdown, `file` + `listaEm()` para JSON) e um esquema Zod.
2. Registe-a no objeto `collections` exportado no fim do ficheiro.
3. Crie o diretório ou o ficheiro JSON de origem.
4. Crie as rotas em `src/pages/` — uma coleção nova **não gera rotas sozinha**.
5. Acrescente a coleção ao `public/admin/config.yml`.
6. Se for para aparecer no menu, acrescente a entrada a `NAVEGACAO` em
   `src/lib/navegacao.ts`.
