# Componentes

`src/components/` tem **19 componentes `.astro`, todos em uso** — verificado nesta auditoria,
não há componentes órfãos. Nenhum usa diretivas `client:*`: a interatividade é feita com
blocos `<script>` simples, carregados com a página que os usa.

Convenções em vigor:

- marcação, estilos com âmbito e script no mesmo ficheiro;
- props tipadas numa `interface Props`;
- português nos nomes de props e nos textos visíveis;
- tokens do sistema de design em vez de valores fixos.

---

## Catálogo

| Componente | O que faz | Props principais |
| --- | --- | --- |
| `Cabecalho.astro` | Cabeçalho do sítio: logótipo, navegação com submenus, menu para telemóvel, alternância de tema, atalho para a área reservada | — (lê `NAVEGACAO`) |
| `Rodape.astro` | Rodapé: contactos, secções, redes sociais, ligações legais | — (lê `SITIO`) |
| `Logotipo.astro` | Logótipo com sigla e subtítulo (que desaparece quando não cabe) | — |
| `AlternarTema.astro` | Botão de tema claro/escuro, com persistência em `localStorage` dentro de `try`/`catch` | — |
| `Heroi.astro` | Herói da página inicial, com indicativo, quadrícula e estatísticas | `estatisticas?: { valor, rotulo }[]` |
| `FundoEspectro.astro` | Fundo animado de espectro, desligado por `prefers-reduced-motion` | — |
| `Icone.astro` | 35 ícones SVG em linha, sem dependências externas | `nome`, `tamanho?`, `class?`, `titulo?` |
| `MigalhasPao.astro` | Migalhas de pão **e** o JSON-LD `BreadcrumbList` da página | `itens: { rotulo, href? }[]` |
| `Aviso.astro` | Caixa de aviso, em três variantes | `tipo?: 'info' \| 'historico' \| 'tarefa'`, `titulo?` |
| `EstadoVazio.astro` | Mensagem para listas e filtros sem resultados | `titulo`, `descricao?`, `icone?`, `accaoHref?`, `accaoRotulo?` |
| `DistintivoEstado.astro` | Estado operacional com símbolo **e** texto | `estado`, `compacto?` |
| `BotaoCopiar.astro` | Copia um valor para a área de transferência e anuncia na região `aria-live` | `valor`, `rotulo`, `class?` |
| `TabelaRepetidores.astro` | Tabela + cartões de repetidores, com pesquisa e filtros no cliente | `repetidores`, `comFiltros?`, `legenda?` |
| `Mapa.astro` | Mapa Leaflet diferido, com lista de localizações em texto | `marcadores`, `rotulo`, `zoom?`, `altura?`, `centro?`, `id?` |
| `CartaoArtigo.astro` | Cartão de notícia ou artigo, em três variantes | `href`, `titulo`, `resumo`, `data`, `categoria?`, `imagem?`, `variante?`, `nivel?`, `prioritaria?`… |
| `CartaoEvento.astro` | Cartão de evento, com estado calculado e marca de cancelado | entrada do evento |
| `IndiceConteudos.astro` | Índice de conteúdos com realce da secção em leitura (`IntersectionObserver` + `aria-current`) | `titulos: MarkdownHeading[]` |
| `Paginacao.astro` | Navegação numerada entre páginas de listagem | página atual, total, base |
| `Partilhar.astro` | Partilha nativa (Web Share API), só onde existe, mais botão de impressão | `titulo`, `url` |

---

## Componentes que merecem atenção

### `Icone.astro`

Os 35 ícones estão como caminhos SVG num objeto `CAMINHOS`, com traço de 1.75 para
condizer com o peso tipográfico do sítio:

```text
antena · onda · satelite · repetidor · livro · documento · pessoas · mapa · local ·
correio · calendario · pesquisa · copiar · partilhar · descarregar · externo · seta ·
setaCima · menu · fechar · sol · lua · info · aviso · relogio · ferramenta · energia ·
rede · codigo · escudo · estrela · facebook · qr · imprimir · filtro
```

`nome` é tipado como `keyof typeof CAMINHOS`, pelo que um nome inválido é apanhado por
`npm run check`. Vários ficheiros de dados (`direcao-tecnica.json`, `navegacao.ts`,
`sitio.json`) referem ícones **por nome, em texto** — aí, o TypeScript não ajuda: um nome
errado dá um ícone vazio.

### `DistintivoEstado.astro`

Único ponto onde o estado operacional é traduzido para interface. Mostra sempre símbolo e
texto; `compacto` esconde o texto **visualmente**, mantendo-o para leitores de ecrã. Ver
[Acessibilidade](Acessibilidade.md#estado-nunca-só-por-cor).

### `BotaoCopiar.astro`

Usa **delegação**: um único ouvinte de `click` por página, guardado por
`window.__arlaCopiar`, em vez de um ouvinte por botão — o que interessa numa tabela com
dezenas de botões. Tem alternativa para navegadores sem Clipboard API (ou em contexto não
seguro), através de um `<textarea>` temporário e `document.execCommand('copy')`, e escreve
a confirmação na região `#anuncio-acessibilidade` de `Base.astro`.

### `Mapa.astro`

Carrega o Leaflet por `import()` dinâmico, só quando o elemento entra no ecrã. Exporta o
tipo `Marcador`, usado por `src/lib/rede.ts`. A lista em texto dentro de `<details>` não é
um extra: é a alternativa acessível e sem JavaScript, e deve ser mantida em qualquer
alteração.

### `TabelaRepetidores.astro`

O componente mais complexo do projeto: gera duas vistas dos mesmos dados e filtra-as no
cliente. Ver [Sistema de Repetidores](Sistema-de-Repetidores.md).

### `CartaoArtigo.astro`

A prop `nivel` (`2 | 3 | 4`) existe para manter a hierarquia de títulos correta consoante o
contexto da listagem — foi acrescentada para corrigir um salto de `<h1>` para `<h3>`
detetado nos testes de acessibilidade. A prop `prioritaria` carrega a imagem sem
`loading="lazy"`, e só deve ser usada no primeiro cartão acima da dobra.

---

## Criar um componente

1. Ficheiro `.astro` em `src/components/`, com nome em português e em `PascalCase`, como os
   existentes.
2. `interface Props` com os campos tipados e comentários `/** … */` onde o nome não chegue.
3. Marcação semântica — o elemento certo antes de qualquer classe.
4. Estilos num bloco `<style>` **com âmbito**, usando tokens. Para estilizar um componente
   filho, `:global()` — os estilos com âmbito do Astro não o alcançam.
5. Script, se for mesmo preciso, num bloco `<script>` no próprio ficheiro. Sem framework,
   sem `client:*`.
6. Estado ou significado transmitido por cor precisa de um segundo sinal.
7. `npm run check && npm run build && npm run qa`.
