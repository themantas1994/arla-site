# Balizas e Rede

Além dos repetidores ([Sistema de Repetidores](Sistema-de-Repetidores.md)), a secção
**Rede ARLA** cobre as balizas, os digipeaters APRS, a estação de uso coletivo e o mapa.

| Página | Ficheiro | Fonte dos dados |
| --- | --- | --- |
| `/rede/` | `src/pages/rede/index.astro` | Resumo das coleções `repetidores` e `balizas` |
| `/rede/repetidores/` | `src/pages/rede/repetidores.astro` | Coleção `repetidores` |
| `/rede/balizas/` | `src/pages/rede/balizas.astro` | Coleção `balizas` |
| `/rede/aprs/` | `src/pages/rede/aprs.astro` | Coleção `repetidores`, filtrada por `filtros.includes('aprs')` |
| `/rede/cs5arla/` | `src/pages/rede/cs5arla.astro` | Conteúdo estático |
| `/rede/mapa/` | `src/pages/rede/mapa.astro` | `marcadoresDaRede()` + coordenadas da sede (`sitio.json`) |

---

## Balizas — IMPLEMENTADO

**Fonte:** `src/data/balizas.json`, coleção `balizas`, 4 registos. Todas com o indicativo
`CS5BLA`, em Aldeia dos Chãos, quadrícula `IM57px`: 50, 144, 432 e 1296 MHz.

### Esquema

| Campo | Tipo | Obrigatório | Notas |
| --- | --- | --- | --- |
| `id` | `string` | Sim | Convenção em uso: `cs5bla-<banda>` (ex.: `cs5bla-144`) |
| `banda` | `string` | Sim | **Texto livre**, ao contrário dos repetidores (ex.: `"VHF 144 MHz"`) |
| `localizacao` | `string` | Sim | |
| `quadricula` | `string` | Não | Quadrícula Maidenhead; posiciona no mapa |
| `coordenadas` | `{ lat, lon }` | Não | Coordenadas exatas; têm prioridade sobre a quadrícula |
| `frequencia` | `string` | Sim | **Uma só** frequência, ao contrário de Tx/Rx nos repetidores |
| `modo` | `string` | Sim | Em uso: `CW (A1A)` |
| `potencia` | `string` | Não | Em watts |
| `indicativo` | `string` | Sim | |
| `antena` | `string` | Não | Campo que não existe nos repetidores |
| `estado` | enum | Sim | Os mesmos quatro valores dos repetidores |
| `notas` | `string` | Não | Mostrado por baixo da frequência (ex.: «Aguarda nova licença.») |

As balizas **não têm** `canal`, `acesso`, `tom` nem `filtros` — e, por não terem `filtros`,
a página de balizas não tem barra de filtros nem pesquisa.

### Apresentação

`src/pages/rede/balizas.astro` segue o mesmo padrão de duas vistas dos repetidores — tabela
em `.so-largo`, cartões em `.so-estreito` — mas com o breakpoint em **900px** (a tabela tem
uma coluna a mais, a da antena), e não em 860px. Colunas: Banda · Localização · Frequência
(MHz) · Modo · P.A.R. · Indicativo · Antena · Estado. A frequência traz um `BotaoCopiar`.

Por baixo, a página mostra o mapa apenas com as balizas
(`marcadoresDaRede({ repetidores: false, balizas: true })`).

### Manutenção

- **Mudar o estado ou acrescentar uma nota:** CMS → **Rede ARLA → Balizas**, ou editar
  `src/data/balizas.json`.
- **Acrescentar uma baliza:** um objeto novo no array `balizas`, com pelo menos `id`,
  `banda`, `localizacao`, `frequencia`, `modo`, `indicativo` e `estado`. Sem `quadricula`
  nem `coordenadas`, a baliza aparece na tabela mas **não** no mapa.
- **Acrescentar um campo:** esquema em `src/content.config.ts`, campo no
  `public/admin/config.yml`, coluna na tabela **e** entrada nos cartões de
  `rede/balizas.astro`.

---

## APRS — IMPLEMENTADO

`/rede/aprs/` não tem dados próprios: filtra a coleção `repetidores` por
`filtros.includes('aprs')`, o que hoje devolve `CQ0PLA` (Aldeia dos Chãos) e `CQ0PST`
(Setúbal), ambos em 144.800 MHz.

**Consequência a conhecer:** um digipeater APRS novo acrescenta-se a `repetidores.json`, com
`aprs` em `filtros`. Sem essa chave, não aparece em `/rede/aprs/`. E como está na coleção
`repetidores`, aparece também na tabela geral de repetidores — é uma decisão deliberada, para
manter a rede toda num só sítio.

---

## Mapa da rede — IMPLEMENTADO

`src/lib/rede.ts` → `marcadoresDaRede({ repetidores?, balizas? })` devolve um array de
`Marcador` para o componente `Mapa.astro`:

```ts
const pos = d.coordenadas ?? (d.quadricula ? quadriculaParaCoordenadas(d.quadricula) : null);
if (!pos) continue;
```

| Propriedade do marcador | Origem |
| --- | --- |
| `lat` / `lon` | `coordenadas` ou o centro da quadrícula |
| `titulo` | Indicativo (nas balizas, `indicativo — banda`) |
| `descricao` | Banda, modo, localização, quadrícula e frequências (HTML) |
| `tipo` | `'repetidor'`, `'baliza'`, `'sede'` ou `'evento'` — determina a cor |
| `origem` | `'exata'` ou `'quadricula'` — determina o aviso de posição aproximada |
| `url` | Ligação «Ver detalhes» no popup |

`/rede/mapa/` acrescenta a estes um marcador `tipo: 'sede'` com as coordenadas de
`sitio.json`, essas sim exatas, e mostra uma legenda de cores.

### Precisão e honestidade dos dados

`src/lib/maidenhead.ts` devolve sempre o **centro** da quadrícula, com uma `precisaoKm`
indicativa (≈4 km para um locator de 6 caracteres, ≈60 km para um de 4). O sítio nunca
apresenta uma posição como mais precisa do que a fonte permite:

- o popup do marcador diz «Posição aproximada (centro da quadrícula)»;
- a nota por baixo do mapa explica-o;
- a página `/rede/mapa/` acrescenta um aviso a dizer que a sub-quadrícula corresponde a uma
  área com cerca de 5 × 9 km.

**Hoje nenhuma estação tem `coordenadas` preenchidas.** Se a direção vier a ter coordenadas
rigorosas, preenchê-las no CMS substitui a posição aproximada e faz desaparecer o aviso
para essa estação, sem qualquer alteração ao código.

Não são desenhados polígonos de cobertura, porque a associação não publica estudos de
cobertura verificados.

### Carregamento e acessibilidade

`Mapa.astro` só carrega o Leaflet quando o elemento entra no ecrã
(`IntersectionObserver` com `rootMargin: '250px'`), por `import()` dinâmico do pacote e do
seu CSS — nunca de um CDN. As telas vêm de `tile.openstreetmap.org`, com atribuição.

Todos os mapas têm uma **alternativa em texto**: um `<details>` com a lista completa de
localizações, coordenadas e indicação de posição aproximada. Funciona sem JavaScript, com
leitor de ecrã e quando a rede bloqueia as telas. O `<noscript>` explica-o explicitamente.

O zoom com a roda do rato só é ativado depois de um clique no mapa, para não roubar o
deslocamento da página.
