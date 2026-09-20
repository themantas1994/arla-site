# Sistema de Design

Não há framework de CSS — nem Tailwind, nem CSS Modules, nem Sass. Todo o sistema de design
está em [`src/styles/global.css`](../src/styles/global.css), 507 linhas, importado uma única
vez a partir de `Base.astro`.

Os tokens abaixo são os que estão **de facto** no ficheiro. Ao acrescentar UI, use-os em vez
de valores fixos: é o que mantém os dois temas e a escala de espaçamento coerentes nos 19
componentes.

---

## Camadas

```css
@layer reset, tokens, base, components, utilities;
```

A ordem é declarada no início do ficheiro, pelo que a especificidade dentro de cada camada
deixa de importar para a precedência entre camadas: `utilities` ganha sempre a `components`,
`components` a `base`, e assim por diante. O bloco `@media print` está **fora** de todas as
camadas, no fim do ficheiro.

---

## Tokens

### Cor de marca

| Token | Valor |
| --- | --- |
| `--arla-200` | `#a8dcfa` |
| `--arla-300` | `#64bdf0` |
| `--arla-400` | `#2c9fe0` |
| `--arla-500` | `#0082c8` (cor do logótipo) |
| `--arla-600` | `#0068a3` |
| `--arla-700` | `#08507e` |
| `--arla-900` | `#072f4a` |

### Cores de estado

| Token | Tema escuro | Tema claro | Significado |
| --- | --- | --- | --- |
| `--sinal` | `#2dd4a7` | `#0a6e53` | Operacional |
| `--alerta` | `#f0a32c` | `#9a6100` | Em manutenção |
| `--falha` | `#f2604c` | `#c0392b` | Indisponível |

Os valores do tema claro são mais escuros de propósito: os originais não chegavam ao
contraste de 4,5:1 sobre fundo claro. Ver
[`docs/qualidade.md`](../docs/qualidade.md#o-que-foi-corrigido-durante-os-testes).

### Espaçamento

| Token | Valor |
| --- | --- |
| `--e-1` | `0.25rem` |
| `--e-2` | `0.5rem` |
| `--e-3` | `0.75rem` |
| `--e-4` | `1rem` |
| `--e-5` | `1.5rem` |
| `--e-6` | `2rem` |
| `--e-7` | `3rem` |
| `--e-8` | `clamp(3rem, 6vw, 4.5rem)` |
| `--e-9` | `clamp(4rem, 9vw, 7rem)` |

Base de 4 px; as duas medidas maiores são fluidas.

### Tipografia

| Token | Valor |
| --- | --- |
| `--t-xs` | `0.78rem` |
| `--t-sm` | `0.875rem` |
| `--t-base` | `1rem` |
| `--t-md` | `1.0625rem` (tamanho do `body`) |
| `--t-lg` | `clamp(1.125rem, 0.5vw + 1rem, 1.3rem)` |
| `--t-xl` | `clamp(1.35rem, 1vw + 1.1rem, 1.7rem)` |
| `--t-2xl` | `clamp(1.6rem, 1.8vw + 1.2rem, 2.25rem)` |
| `--t-3xl` | `clamp(2rem, 3vw + 1.2rem, 3rem)` |
| `--t-4xl` | `clamp(2.4rem, 5vw + 1.1rem, 4.2rem)` |

Tipos de letra:

- `--fonte-base`: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, …`
- `--fonte-mono`: `ui-monospace, "SFMono-Regular", "JetBrains Mono", …`

**Nenhum tipo de letra é descarregado.** É a pilha do sistema, que carrega instantaneamente
e respeita as definições de quem visita.

### Raios, layout e movimento

| Token | Valor |
| --- | --- |
| `--raio-sm` | `6px` |
| `--raio` | `12px` |
| `--raio-lg` | `18px` |
| `--raio-xl` | `26px` |
| `--largura` | `1200px` (largura máxima do conteúdo) |
| `--largura-texto` | `72ch` (largura de leitura) |
| `--transicao` | `160ms cubic-bezier(0.4, 0, 0.2, 1)` |

---

## Temas

O **escuro é a predefinição**: os valores vivem em `:root` e em `:root[data-tema='escuro']`.
O tema claro está em `:root[data-tema='claro']` e, para quem nunca escolheu, num bloco
`@media (prefers-color-scheme: light) { :root:not([data-tema]) { … } }`.

Não é uma inversão: o tema claro tem os seus próprios valores de superfície, texto, borda e
estado, afinados para contraste.

Tokens semânticos definidos por tema:

| Token | Para que serve |
| --- | --- |
| `--fundo`, `--fundo-2` | Fundo da página |
| `--superficie`, `--superficie-2`, `--superficie-alta` | Cartões e blocos, em três níveis |
| `--texto`, `--texto-suave`, `--texto-fraco` | Hierarquia de texto |
| `--borda`, `--borda-forte` | Linhas e contornos |
| `--accent`, `--accent-forte`, `--accent-contraste` | Cor de ação (apontam para tons `--arla-*` diferentes em cada tema) |
| `--sombra`, `--sombra-alta` | Elevação |
| `--grelha-linha`, `--realce-hero` | Padrão de grelha técnica e gradiente do herói |

`color-scheme` é declarado em cada tema, para que os controlos nativos do navegador
acompanhem.

### Como o tema é aplicado

1. Um script `is:inline` em `Base.astro` corre **antes da primeira pintura** e lê
   `localStorage.getItem('arla-tema')`, escrevendo `data-tema` no `<html>`. É o que evita o
   salto de cor ao carregar.
2. `AlternarTema.astro` alterna e grava a escolha.
3. **Todos os acessos ao `localStorage` estão dentro de `try`/`catch`**: em janela privada
   ou com armazenamento bloqueado, o botão continua a funcionar e fica a valer a preferência
   do sistema.

---

## Movimento reduzido

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Componentes com animação própria (`FundoEspectro.astro`, os indicadores de estado) têm
também as suas próprias regras de `prefers-reduced-motion`. Um efeito de *hover* animado
está condicionado a `@media (hover: hover) and (prefers-reduced-motion: no-preference)`.

---

## Utilitários que convém conhecer

| Classe | O que faz |
| --- | --- |
| `.envolvente` | Contentor centrado, com `--largura` e espaçamento interior (aumenta a partir de 640 px) |
| `.prosa` | Coluna de texto com `--largura-texto` |
| `.invisivel` | Esconde visualmente, mantendo o conteúdo para leitores de ecrã |
| `.nao-imprimir` | Escondido no `@media print` |
| `.mono` | Tipo monoespaçado com `tabular-nums` (frequências, indicativos, IBAN) |
| `.num` | Variante para células de tabela (`table.dados .num`), com `white-space: nowrap` |
| `.suave`, `.fraco` | `--texto-suave` e `--texto-fraco` |
| `.linha`, `.empilhar` | Flex horizontal com quebra e flex vertical |
| `.grelha`, `.grelha--auto`, `.grelha--auto-sm`, `.grelha--2` | Grelhas reutilizáveis, com colunas automáticas |
| `.cartao` | Bloco com superfície, borda e raio |
| `.btn`, `.btn--principal`, `.btn--contorno`, `.btn--fantasma`, `.btn--pequeno` | Botões |
| `.etiqueta` | Etiquetas de categoria e filtros |
| `.grelha-tecnica` | Padrão de grelha usado em fundos |
| `.tabela-envolvente`, `table.dados` | Tabelas de dados |
| `.so-largo` / `.so-estreito` | **Não são globais** — cada ficheiro que as usa define-as com o seu próprio ponto de rutura. Ver [Design Responsivo](Design-Responsivo.md) |

---

## Impressão

O bloco `@media print` no fim do ficheiro:

- força fundo branco, texto preto e 11 pt;
- esconde cabeçalho, rodapé, `.nao-imprimir`, `.barra-filtros` e `.paginacao`;
- remove o limite de largura da `.prosa`;
- **escreve o endereço a seguir a cada ligação externa** (`a[href^='http']::after`);
- reduz as tabelas de dados a 9 pt e evita quebras dentro de cartões e tabelas.

Os estados dos repetidores continuam legíveis porque `DistintivoEstado.astro` usa símbolo e
texto, não só cor.

---

## Acrescentar UI nova

1. Escreva a marcação no componente `.astro` e os estilos num bloco `<style>` **com âmbito**
   nesse ficheiro (é o comportamento predefinido do Astro).
2. Use tokens: `var(--accent)`, `var(--e-4)`, `var(--raio)`, `var(--t-sm)` — não
   `#0082c8`, `1rem` nem `12px`.
3. Não acrescente cores fora dos tokens sem verificar o contraste nos **dois** temas.
4. Se precisar de estilizar um componente filho a partir do pai, use `:global()` — os
   estilos com âmbito do Astro não alcançam o componente filho. Este foi um defeito real,
   registado em [`docs/qualidade.md`](../docs/qualidade.md#revisão-visual).
5. Só acrescente ao `global.css` o que for mesmo transversal: um token novo, um utilitário
   novo ou uma regra de impressão.
6. Depois: `npm run build && npm run qa` — o guião de QA verifica contraste, transbordo e
   alvos de toque nos dois temas.
