# Design Responsivo

**Este projeto não tem uma escala única de breakpoints.** É importante saber isso antes de
mexer no CSS: procurar «o breakpoint dos tablets» não dá resultado, porque cada componente
muda de forma quando o seu próprio conteúdo o exige.

O `global.css` tem **um único** breakpoint de largura; tudo o resto está nos componentes e
nas páginas.

---

## Onde está cada breakpoint

| Largura | Ficheiro | O que muda |
| --- | --- | --- |
| `560px` | `Paginacao.astro`, `arla/quotizacao.astro`, `contactos.astro` | Grelhas locais |
| `620px` | `arla/ser-associado.astro`, `eventos/[...slug].astro` | Grelhas locais |
| `640px` | **`global.css`**, `Rodape.astro`, `Artigo.astro` | Espaçamento interior de `.envolvente`; layout do rodapé e do cabeçalho do artigo |
| `700px` | `global.css` (`so-*--700`), usado por `arla/quem-somos.astro` | **Tabela de associados → cartões** |
| `720px` | `arla/historia.astro`, `rede/repetidores.astro` | Grelhas locais |
| `760px` | `radioamadorismo/comecar.astro`, `radioamadorismo/meteorologia-espacial.astro` | Grelhas locais |
| `800px` | `radioamadorismo/index.astro` | Grelha local |
| `860px` | `global.css` (`so-*--860`), usado por `TabelaRepetidores.astro` | **Tabela de repetidores → cartões** |
| `880px` | `CartaoArtigo.astro` | Cartão de artigo em destaque |
| `900px` | `global.css` (`so-*--900`), usado por `rede/balizas.astro`; também `FundoEspectro.astro` e `radioamadorismo/satelites.astro` | **Tabela de balizas → cartões**; animação de fundo |
| `960px` | `contactos.astro`, `index.astro` | Layouts de duas colunas |
| `1000px` | `Rodape.astro` | Colunas do rodapé |
| `1080px` | `arla/historia.astro` | Cronologia em duas colunas |
| `1100px` | `IndiceConteudos.astro`, `Artigo.astro` | **Índice lateral dos artigos** |
| `1180px` | `Cabecalho.astro` | **Navegação de topo ↔ menu para telemóvel** |
| `1399px` (max) | `Logotipo.astro` | Subtítulo do logótipo |
| `1400px` | `Cabecalho.astro` | Cabeçalho largo |

Todos usam `min-width`, exceto o de `Logotipo.astro`.

---

## Navegação — IMPLEMENTADO

`Cabecalho.astro`, com o ponto de rutura em **1180px**:

- **≥ 1180px:** barra de navegação horizontal com submenus.
- **< 1180px:** botão que abre o menu, com as secções expansíveis.

Os submenus abrem por **clique e por teclado**, não apenas por *hover*: o `pointerenter`
existe como conveniência para quem usa rato, mas o comportamento de base é acionado por
clique, com `aria-expanded` mantido correto. `Escape` fecha o submenu aberto e um clique
fora também.

A largura de rutura é alta (1180px, não 1024px) porque o menu tem seis secções com nomes
longos em português; abaixo disso, a barra horizontal deixava de caber.

---

## Tabelas → cartões — IMPLEMENTADO

Três tabelas de dados têm uma vista alternativa em cartões. **O padrão está definido uma só
vez**, em `src/styles/global.css`, na camada `utilities` (auditoria: DT-011). Cada tabela
escolhe o seu ponto de rutura pela classe com sufixo; nenhuma página repete regras de
`display`.

| Tabela | Ficheiro | Classes | Ponto de rutura | Porquê |
| --- | --- | --- | --- | --- |
| Repetidores | `src/components/TabelaRepetidores.astro` | `so-largo--860` / `so-estreito--860` | 860px | 10 colunas |
| Balizas | `src/pages/rede/balizas.astro` | `so-largo--900` / `so-estreito--900` | 900px | 9 colunas, uma delas larga (antena) |
| Associados | `src/pages/arla/quem-somos.astro` | `so-largo--700` / `so-estreito--700` | 700px | 5 colunas |

No HTML, as duas classes andam sempre juntas — a genérica traz o comportamento, a do sufixo
traz o ponto de rutura:

```html
<div class="tabela-envolvente so-largo so-largo--860"> … </div>
<ul   class="cartoes-repetidores so-estreito so-estreito--860"> … </ul>
```

Em `global.css`:

```css
.so-largo    { display: none; }
.so-estreito { display: grid; gap: var(--e-3); }

@media (min-width: 700px) { .so-largo--700 { display: block } .so-estreito--700 { display: none } }
@media (min-width: 860px) { .so-largo--860 { display: block } .so-estreito--860 { display: none } }
@media (min-width: 900px) { .so-largo--900 { display: block } .so-estreito--900 { display: none } }
```

E, no bloco `@media print` no fim do ficheiro:

```css
.so-largo    { display: block !important; }
.so-estreito { display: none  !important; }
```

**Porquê três valores e não um.** Não é inconsistência: cada tabela deixa de caber a uma
largura própria, e forçar as três ao mesmo ponto de rutura ou mostraria a tabela de
repetidores espremida a 700px, ou passaria a de associados a cartões muito antes de ser
preciso. O que estava duplicado — e deixou de estar — era o *comportamento*, não o valor.

**Porquê `!important` na impressão.** As regras partilhadas estão numa camada `@layer`, e
os `<style>` de componente do Astro não estão em camada nenhuma — ganhariam à regra de
impressão. O `!important` garante que o papel leva sempre a tabela.

Pontos que valem a pena reter:

- **A alternância é só CSS.** As duas vistas estão no HTML; nenhum JavaScript decide o
  layout. Funciona antes de qualquer script correr, e com JavaScript desligado.
- **Os dados aparecem duas vezes no DOM.** Por isso os filtros dos repetidores escondem
  ambas as vistas e a contagem elimina duplicados. Ao acrescentar uma coluna, acrescente-a
  também aos cartões — senão o telemóvel e o computador passam a mostrar informação
  diferente.
- **A impressão força sempre a tabela**, mesmo em ecrãs estreitos: uma lista de repetidores
  impressa deve continuar a ser uma tabela.

Outras tabelas do sítio (por exemplo, a da página de cookies) usam
`.tabela-envolvente { overflow-x: auto }`, que desloca a tabela dentro do seu contentor em
vez de a converter em cartões. A página `/arquivo/` **não usa tabela** — é uma lista
filtrável.

---

## Outros comportamentos

| Elemento | Comportamento |
| --- | --- |
| Imagens | `max-width: 100%; height: auto` no reset; `loading="lazy"` e `decoding="async"` abaixo da dobra, com dimensões explícitas para não provocar saltos de layout |
| Tipografia | Fluida por `clamp()` a partir de `--t-lg` |
| Espaçamento | `--e-8` e `--e-9` fluidos; o resto é fixo |
| Mapas | Altura fluida (`clamp(22rem, 62vh, 36rem)` no mapa da rede); a lista em texto por baixo é sempre a alternativa |
| Pesquisa e filtros | Os botões de filtro quebram para a linha seguinte (`flex-wrap`), com 2,5 rem de altura mínima |
| Formulários | Não há formulários com submissão; os campos existentes são de pesquisa e filtro |
| Cartões | Grelhas com `repeat(auto-fill, minmax(min(100%, Xrem), 1fr))`, que se adaptam sem breakpoint |

---

## Verificação — IMPLEMENTADO

`npm run qa` percorre **37 páginas em 7 larguras** (320, 375, 390, 768, 1024, 1280 e
1440 px) e falha se houver transbordo horizontal; verifica também os alvos de toque a
375 px. A última execução não encontrou transbordo em nenhuma largura.

Para inspeção visual: `npm run qa:capturas` gera capturas em `reports/capturas/` — 16
páginas em três formatos (1440×1000 «desktop», 768×1024 «tablet», 390×844 «telemóvel») e
nos dois temas, com um subconjunto de páginas nos formatos menores para não gerar centenas
de ficheiros.

---

## Ao acrescentar um breakpoint

Não há uma escala a respeitar, e inventar uma agora exigiria rever 30 ficheiros. A regra
prática em uso é: **escolha a largura em que o conteúdo deixa de caber**, não uma largura de
dispositivo. Se a mudança for do mesmo tipo de uma já existente (por exemplo, mais uma
tabela a passar a cartões), reutilize o breakpoint da tabela mais parecida em número de
colunas, para não multiplicar valores.

Para uma tabela nova, use um dos três pares `so-largo--700/860/900` já existentes. Só se
nenhum servir acrescente um par novo em `global.css` — e nunca escreva regras de `display`
para `.so-largo`/`.so-estreito` no `<style>` da página: voltaria a espalhar o padrão.

Depois de qualquer alteração de layout: `npm run build && npm run qa`.
