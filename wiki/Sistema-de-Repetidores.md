# Sistema de Repetidores

O diretório de repetidores é a informação mais procurada do sítio: frequências, tons,
acessos e estado operacional que alguém usa para sintonizar um rádio. Por isso tem
validação no build, apresentação dupla (tabela e cartões), alternativa em texto para o mapa
e distintivos de estado que nunca dependem só da cor.

| Peça | Ficheiro |
| --- | --- |
| Dados | `src/data/repetidores.json` |
| Esquema | `src/content.config.ts` (coleção `repetidores`) |
| Apresentação, pesquisa e filtros | `src/components/TabelaRepetidores.astro` |
| Distintivo de estado | `src/components/DistintivoEstado.astro` |
| Botão de cópia | `src/components/BotaoCopiar.astro` |
| Marcadores do mapa | `src/lib/rede.ts` + `src/lib/maidenhead.ts` |
| Páginas | `/rede/repetidores/`, `/rede/mapa/`, `/rede/aprs/`, `/rede/`, página inicial |
| Formulário do CMS | `public/admin/config.yml`, coleção `rede` → ficheiro `repetidores` |

---

## Esquema — IMPLEMENTADO

```ts
const repetidores = defineCollection({
  loader: file('./src/data/repetidores.json', { parser: listaEm('repetidores') }),
  schema: z.object({
    id: z.string(),
    canal: z.string().optional(),
    banda: z.enum(['VHF', 'UHF', 'SHF', 'HF']),
    modo: z.string(),
    filtros: z.array(z.string()).default([]),
    localizacao: z.string(),
    quadricula: z.string().optional(),
    coordenadas: z.object({ lat: z.number(), lon: z.number() }).optional(),
    frequenciaTx: z.string(),
    frequenciaRx: z.string(),
    tom: z.string().optional(),
    acesso: z.string().optional(),
    potencia: z.string().optional(),
    indicativo: z.string(),
    estado: z.enum(['operacional', 'manutencao', 'indisponivel', 'desconhecido']),
    notas: z.string().optional(),
  }),
});
```

Notas de campo:

| Campo | O que convém saber |
| --- | --- |
| `id` | Tem de ser único. Convenção: o indicativo em minúsculas (`cq0varb`). Não é usado em endereços |
| `canal` | Canal normalizado (`RV56`, `RU688`). Pode ser `""`: a tabela mostra `—` |
| `modo` | **Texto livre**, não um enum. Valores em uso: `Analógico`, `Digital DMR`, `Digital D-Star`, `Digital AX.25 (APRS)` |
| `filtros` | Chaves normalizadas que ligam o registo aos botões de filtro. O CMS restringe-as a `vhf`, `uhf`, `analogico`, `digital`, `dmr`, `dstar`, `aprs`; **o esquema Zod aceita qualquer `string`** |
| `frequenciaTx` / `frequenciaRx` | `string`, para preservar os zeros (`145.7000`). A unidade (MHz) está no cabeçalho da coluna, não no valor |
| `tom` e `acesso` | `tom` é o CTCSS; `acesso` é o que a tabela mostra (CTCSS, `TG 2 – 268303 · CC 1`, `XRF268`). A tabela usa `acesso || tom || '—'` |
| `potencia` | `string`, em watts. A coluna chama-se **P.A.R.** e mostra `{potencia} W` |
| `estado` | Enum de quatro valores. Ver abaixo |

**Atenção aos dois digipeaters APRS.** `CQ0PLA` e `CQ0PST` estão nesta coleção e aparecem
na tabela de repetidores, embora não sejam repetidores de voz: têm `frequenciaTx` igual a
`frequenciaRx` (144.8000) e `acesso: "—"`. É uma decisão deliberada, para que a rede toda
esteja num só sítio; `/rede/aprs/` descreve-os separadamente.

---

## Estado operacional — IMPLEMENTADO

| Valor | Rótulo apresentado | Símbolo | Quando usar |
| --- | --- | --- | --- |
| `operacional` | Operacional | `●` | A funcionar normalmente |
| `manutencao` | Em manutenção | `◐` | Fora de serviço temporariamente, com intervenção prevista |
| `indisponivel` | Indisponível | `✕` | Fora de serviço, sem previsão |
| `desconhecido` | Estado por confirmar | `?` | Não se sabe |

`DistintivoEstado.astro` produz sempre símbolo **e** texto, com a cor a vir de `--sinal`,
`--alerta`, `--falha` ou `--texto-fraco`. Isto mantém o estado legível para quem não
distingue cores e em impressão a preto e branco. A prop `compacto` esconde visualmente o
texto, mantendo-o disponível para leitores de ecrã.

O mesmo campo alimenta a tabela, os cartões, a página inicial e o resumo da rede — há um
único sítio a atualizar.

---

## Apresentação — IMPLEMENTADO

`TabelaRepetidores.astro` gera **duas vistas dos mesmos dados**, no mesmo HTML:

- uma `<table class="dados">` dentro de `.so-largo`;
- uma lista de cartões `<ul class="cartoes-repetidores">` dentro de `.so-estreito`.

A alternância é puramente CSS, com `@media (min-width: 860px)`: acima disso mostra-se a
tabela, abaixo os cartões. Um bloco `@media print` força a tabela também na impressão, para
que uma lista impressa continue a ser uma tabela.

Colunas da tabela: Canal · Banda · Modo · Localização (com a quadrícula por baixo) · Tx (MHz)
· Rx (MHz) · Acesso · P.A.R. · Indicativo · Estado. Cada frequência e cada indicativo trazem
um `BotaoCopiar` (escondido na impressão, com `nao-imprimir`).

As classes `.so-largo` e `.so-estreito` **não são globais**: estão definidas dentro de cada
componente ou página que as usa, com breakpoints diferentes. Ver
[Design Responsivo](Design-Responsivo.md).

### Props

```ts
interface Props {
  repetidores: CollectionEntry<'repetidores'>[];
  comFiltros?: boolean;   // predefinição true; false nos resumos da página inicial
  legenda?: string;       // <caption> da tabela
}
```

---

## Pesquisa e filtros — IMPLEMENTADO

Tudo no cliente, num `<script>` do próprio componente. Sem framework e sem pedidos de rede.

- **Pesquisa por texto.** Cada linha e cada cartão trazem um atributo `data-texto` com canal,
  banda, modo, localização, quadrícula, frequências e indicativo, já em minúsculas. A
  comparação passa ambos os lados por `normalize('NFD')` e remove os diacríticos, de modo que
  «arrabida» encontra «Arrábida».
- **Filtros.** Os botões são gerados a partir dos valores que existem de facto nos dados
  (`disponiveis`), pelo que um filtro sem repetidores correspondentes nem aparece. As chaves
  dividem-se em dois grupos:
  - **banda** — `vhf`, `uhf`;
  - **modo** — tudo o resto (`analogico`, `dmr`, `dstar`, `aprs`).

  Dentro de cada grupo a relação é **ou**; entre grupos é **e**. Marcar «UHF» e «DMR» mostra
  os repetidores UHF *e* DMR.
- **Contagem.** O `<p data-contagem aria-live="polite">` anuncia o número de resultados.
  Como cada repetidor existe duas vezes no DOM (tabela e cartão), a contagem elimina
  duplicados através de um `Set` com o valor de `data-texto`.
- **Estado vazio.** Sem correspondências, as duas vistas são escondidas e aparece
  `EstadoVazio.astro`.
- **Limpar.** O botão «Limpar» só é visível quando há algum filtro ou texto ativo, e devolve
  o foco ao campo de pesquisa.

Resultado verificado pelos testes funcionais (`npm run qa`): o filtro UHF reduz de 9 para 5
linhas, e «arrabida» devolve 4 resultados.

---

## Mapa — IMPLEMENTADO

`src/lib/rede.ts` constrói os marcadores:

```ts
const pos = d.coordenadas ?? (d.quadricula ? quadriculaParaCoordenadas(d.quadricula) : null);
if (!pos) continue;   // sem posição conhecida, não há marcador
```

Ou seja, `coordenadas` (exatas) tem prioridade; na sua ausência, a posição vem do **centro
da quadrícula Maidenhead**, calculado por `src/lib/maidenhead.ts` (que devolve também uma
`precisaoKm`: ≈4 km para locators de 6 caracteres, ≈60 km para os de 4). O marcador é
marcado com `origem: 'quadricula'` e:

- o popup do marcador diz «Posição aproximada (centro da quadrícula)»;
- a nota por baixo do mapa explica-o para todas as estações nessa situação;
- a lista em texto (`<details>`) repete a indicação.

**Hoje, nenhum repetidor nem baliza tem `coordenadas` preenchidas**: todas as posições da
rede são aproximadas. Preencher `coordenadas` no CMS substitui a posição aproximada e faz
desaparecer o aviso para essa estação.

Não são desenhados polígonos de cobertura. A associação não publica estudos de cobertura
verificados, e desenhá-los seria inventar informação técnica.

---

## Tarefas correntes

### Acrescentar um repetidor

Pelo CMS: **Rede ARLA → Repetidores → Add Repetidor**. Diretamente em JSON, acrescente um
objeto ao array `repetidores`:

```json
{
  "id": "cq0xpto",
  "canal": "RU700",
  "banda": "UHF",
  "modo": "Digital DMR",
  "filtros": ["uhf", "dmr", "digital"],
  "localizacao": "Serra da Arrábida",
  "quadricula": "IM58ml",
  "frequenciaTx": "438.7500",
  "frequenciaRx": "431.1500",
  "tom": "",
  "acesso": "TG 2 – 268303 · CC 1",
  "potencia": "25",
  "indicativo": "CQ0XPTO",
  "estado": "operacional"
}
```

Dois cuidados: `id` tem de ser único, e **`filtros` em falta ou incompleto faz o repetidor
desaparecer assim que alguém filtrar** — aparece na tabela, mas não passa nos filtros. O
esquema não o deteta, porque `filtros` tem predefinição `[]`.

### Alterar o estado

Mude `estado` (e normalmente `notas`, a explicar porquê). A alteração propaga-se a todas as
páginas que leem a coleção; não há mais nada a atualizar.

### Remover ou arquivar

**Não existe marcação de arquivado para repetidores.** Um repetidor desativado ou é removido
do array, ou fica com `estado: "indisponivel"` e uma nota, se a associação quiser manter o
registo publicado. Tenha em conta que remover um registo não afeta endereços — os repetidores
não têm página própria.

### Acrescentar um campo novo

1. `src/content.config.ts` — acrescente o campo ao esquema da coleção `repetidores`
   (opcional, ou com predefinição, para não invalidar os registos existentes).
2. `public/admin/config.yml` — acrescente o campo correspondente na coleção `rede`, ficheiro
   `repetidores`, com `label` em português.
3. `TabelaRepetidores.astro` — acrescente a coluna na tabela **e** a entrada na `<dl>` dos
   cartões; se não fizer as duas, o telemóvel e o computador passam a mostrar informação
   diferente.
4. Se o campo for pesquisável, acrescente-o à cadeia `data-texto` das duas vistas.
5. `npm run check && npm run build && npm run qa`.

### Alterar a interface

Toda a apresentação está em `TabelaRepetidores.astro` — marcação, estilos com âmbito e
script no mesmo ficheiro. Mantenha as duas vistas sincronizadas e não passe a decidir o
layout em JavaScript: a alternância tabela/cartões é intencionalmente feita em CSS, para
funcionar antes de qualquer script correr.

---

## Validação — IMPLEMENTADO

`npm run build` falha se faltar um campo obrigatório (`id`, `banda`, `modo`, `localizacao`,
`frequenciaTx`, `frequenciaRx`, `indicativo`, `estado`) ou se `banda` ou `estado` tiverem um
valor fora do enum. A mensagem identifica a coleção, a entrada e o campo.

O que a validação **não** apanha, e continua a ser responsabilidade de quem edita:

- `filtros` vazio ou incompleto (o repetidor desaparece ao filtrar);
- uma frequência errada, mas bem formatada;
- uma `quadricula` sintaticamente válida mas do sítio errado — `quadriculaParaCoordenadas()`
  só rejeita o que não corresponde ao padrão `^[A-R]{2}[0-9]{2}([A-X]{2})?$`, devolvendo
  `null`, caso em que a estação simplesmente não aparece no mapa;
- `id` duplicado.
