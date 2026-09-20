# Acessibilidade

Objetivo declarado: **WCAG 2.2 AA**.

Esta página separa deliberadamente três coisas que costumam aparecer misturadas:

1. o que está **implementado** no código;
2. o que foi **testado automaticamente**;
3. o que **não foi testado** de todo.

Um resultado de 0 violações no axe-core **não é prova de conformidade WCAG** — verifica
estrutura DOM e ARIA, não usabilidade real.

---

## Implementado

### Estrutura

- Landmarks semânticos: `header`, `nav`, `main`, `article`, `section`, `aside`, `footer`.
- Um só `<h1>` por página e hierarquia de títulos sem saltos, verificada página a página.
  O nível dos títulos dos cartões de listagem é configurável precisamente para não saltar de
  `<h1>` para `<h3>`.
- `<html lang="pt-PT">` em todas as páginas (`Base.astro`).
- Ligação **«Saltar para o conteúdo principal»** como primeiro elemento focável, apontando
  para `<main id="conteudo" tabindex="-1">`.

### Teclado e foco

- **Nada depende de passar o rato.** Os submenus do cabeçalho abrem por clique e por
  teclado, fecham com `Escape` e com clique fora, e mantêm `aria-expanded` correto. O
  `pointerenter` existe como conveniência para quem usa rato, não como o único caminho.
- Foco sempre visível: `:focus-visible` com contorno de 3 px.
- O menu para ecrãs pequenos é operável por teclado, incluindo a expansão das secções.

### Tabelas e dados

- `<caption>`, `<thead>` e `scope="col"` nas colunas.
- Em ecrãs estreitos, **vista em cartões** em vez de uma tabela espremida — repetidores,
  balizas e associados. Ver [Design Responsivo](Design-Responsivo.md).
- `@media print` força a tabela, para que uma lista impressa continue tabular.

### Estado nunca só por cor

`DistintivoEstado.astro` mostra sempre **símbolo e texto**:

| Estado | Símbolo | Texto |
| --- | --- | --- |
| `operacional` | `●` | Operacional |
| `manutencao` | `◐` | Em manutenção |
| `indisponivel` | `✕` | Indisponível |
| `desconhecido` | `?` | Estado por confirmar |

O símbolo tem `aria-hidden="true"` (o texto já o diz) e o conjunto continua legível em
impressão a preto e branco. As cores de estado do tema claro foram escurecidas para
atingirem 4,5:1 — ver [Sistema de Design](Sistema-de-Design.md#cores-de-estado).

### Anúncios dinâmicos

`Base.astro` inclui em todas as páginas:

```html
<div id="anuncio-acessibilidade" class="invisivel" role="status" aria-live="polite"></div>
```

`BotaoCopiar.astro` escreve nesta região ao copiar («145.7000 copiado para a área de
transferência.»). A contagem de resultados dos filtros de repetidores tem o seu próprio
`aria-live="polite"`.

### Mapas

Todos os mapas têm **alternativa em texto**: um `<details>` com a lista completa de
localizações, coordenadas e indicação de posição aproximada, mais um `<noscript>` a
explicá-lo. O mapa nunca é a única forma de obter a informação. O contentor tem
`role="application"` com `aria-label`.

### Movimento e toque

- `prefers-reduced-motion: reduce` desliga animações, a varredura do espectro do herói, a
  pulsação dos indicadores e as transições.
- Alvos de toque de pelo menos 44 × 44 px nos controlos principais. Ligações dentro de
  frases mantêm o tamanho do texto — a WCAG 2.5.8 isenta-as, e aumentá-las estragaria a
  entrelinha.

### Armazenamento

Todos os acessos a `localStorage` estão em `try`/`catch`: em janela privada ou com
armazenamento bloqueado, a alternância de tema continua a funcionar, passando a valer a
preferência do sistema.

---

## Testado automaticamente

`npm run qa`, com **axe-core** através do Playwright, conjuntos de regras `wcag2a`,
`wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` e `best-practice`.

| Métrica | Resultado |
| --- | --- |
| Análises | **74** (37 páginas × tema claro e escuro) |
| Violações | **0** |
| Violações graves ou críticas | **0** |
| Transbordo horizontal (320–1440 px) | Nenhum |
| Alvos de toque < 24 px a 375 px | Nenhum |

Verificações estruturais adicionais, automatizadas no mesmo guião: um só `<h1>` por página,
hierarquia sem saltos, `lang="pt-PT"` declarado, submenus operáveis por teclado
(Enter abre, Escape fecha), nada dependente de *hover*, estados comunicados por símbolo e
texto.

Correções feitas durante estes testes estão registadas em
[`docs/qualidade.md`](../docs/qualidade.md#o-que-foi-corrigido-durante-os-testes):
contraste do verde «operacional» no tema claro, opacidade dos cartões de eventos terminados,
hierarquia de títulos nos cartões de notícias e alvos de toque no rodapé.

---

## Não testado

Isto é tão importante como o que está acima:

- **Leitores de ecrã reais.** NVDA, JAWS e VoiceOver não foram usados. O axe-core verifica
  a estrutura, não a experiência de quem a ouve.
- **Navegação exclusivamente por teclado por um utilizador habitual.** Os testes
  automatizados verificam sequências específicas, não um percurso real de ponta a ponta.
- **Compreensão do texto** por pessoas com dificuldades de leitura.
- **Navegadores além do Chromium.** Safari e Firefox não foram testados.
- **Dispositivos reais.** Os testes usam emulação de viewport, não telemóveis físicos.
- **Ampliação a 200 % e 400 %** e modo de alto contraste do sistema operativo.

Em consequência: **este projeto não declara conformidade WCAG 2.2 AA.** Declara o objetivo,
as medidas implementadas e o resultado das verificações automáticas, e diz o que falta.

---

## Ao alterar a interface

1. Não introduza comportamento que dependa só de *hover*.
2. Estado ou significado transmitido por cor precisa sempre de um segundo sinal (texto,
   símbolo, forma).
3. Verifique o contraste nos **dois** temas, não apenas no escuro.
4. Controlos novos precisam de rótulo acessível — `<label>`, `aria-label` ou texto visível.
5. Se acrescentar um mapa ou um gráfico, acrescente a alternativa em texto ao mesmo tempo.
6. Se acrescentar movimento, acrescente a regra `prefers-reduced-motion`.
7. Corra `npm run qa` e leia a secção de acessibilidade — não é uma formalidade: já apanhou
   quatro problemas reais neste projeto.
