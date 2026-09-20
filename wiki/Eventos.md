# Eventos

A coleção `eventos` (`src/content/eventos/`, 17 ficheiros) estende o esquema editorial comum
com data, local, tipo e estado de cancelamento. O que distingue os eventos das notícias é
que o seu **estado é calculado**, não guardado: nada tem de ser movido à mão entre «o que vem
aí» e «o que já passou».

| Peça | Ficheiro |
| --- | --- |
| Conteúdo | `src/content/eventos/*.md` |
| Esquema | `src/content.config.ts` (coleção `eventos`) |
| Cálculo do estado | `estadoEvento()` em `src/lib/sitio.ts` |
| Consultas | `eventos()`, `eventosFuturos()`, `eventosPassados()` em `src/lib/conteudo.ts` |
| Listagem | `src/pages/eventos/index.astro` |
| Detalhe | `src/pages/eventos/[...slug].astro` |
| Cartão | `src/components/CartaoEvento.astro` |

---

## Frontmatter

Além dos campos comuns (`titulo`, `resumo`, `data`, `categoria`, `etiquetas`, `imagem`,
`imagemAlt`, `rascunho`, `urlAntigo`…), os eventos têm:

```markdown
---
titulo: "12.ª Edição do Fim de Semana AM"
resumo: "Duas frases sobre a atividade."
data: "2024-10-01"              # data de publicação (obrigatória, vem de baseArtigo)
inicio: "2024-10-12"            # OBRIGATÓRIA
fim: "2024-10-13"               # opcional
dataTexto: ""                   # substitui a data formatada, quando esta é aproximada
horaInicio: "09:00"             # opcional, texto livre
horaFim: "18:00"                # opcional
local: "Santiago do Cacém"      # opcional
coordenadas: { lat: 38.0, lon: -8.7 }   # opcional; sem isto não há mapa
organizador: ""                 # vazio = ARLA
inscricoes: ""                  # texto livre
ligacaoExterna: ""              # endereço externo relacionado
tipo: atividade                 # atividade | workshop | concurso | encontro | divulgacao
cancelado: false
---
```

**`inicio` e `data` são ambas obrigatórias.** `data` é a data de publicação (herdada de
`baseArtigo`, usada na ordenação do RSS e do arquivo); `inicio` é a data do evento.

---

## Datas e estado — IMPLEMENTADO

`estadoEvento(inicio, fim?, agora = new Date())` em `src/lib/sitio.ts` compara **dias
completos em UTC**:

```ts
const dia = (d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
if (hoje < inicio) return 'futuro';
if (hoje > (fim ?? inicio)) return 'terminado';
return 'adecorrer';
```

| Valor | Rótulo (`ROTULO_ESTADO_EVENTO`) |
| --- | --- |
| `futuro` | Brevemente |
| `adecorrer` | A decorrer |
| `terminado` | Terminado |

Comparar dias em UTC evita que o fuso horário de quem constrói o sítio altere a
classificação de um evento.

**Um efeito a conhecer:** como o estado é calculado no build a partir do dia corrente, um
evento que termine hoje passa a «Terminado» apenas no build seguinte. Num sítio estático
sem publicação automática, isso significa que a lista de eventos envelhece até à próxima
publicação. É o comportamento esperado, não uma avaria.

`src/lib/conteudo.ts`:

- `eventos()` — todos, por `inicio` decrescente;
- `eventosFuturos()` — os que não estão `terminado`, por `inicio` **crescente** (o mais
  próximo primeiro);
- `eventosPassados()` — os `terminado`.

### `dataTexto`

Quando as datas exatas não servem («Todos os domingos de julho de 2023, entre as 21:00 e as
22:00»), preencha `dataTexto`: esse texto substitui a data formatada em todo o sítio. Os
campos `inicio`/`fim` continuam a ser necessários para a classificação e a ordenação.

Quando `dataTexto` está vazio, a data é formatada por `intervaloDatas(inicio, fim)`, que
evita repetir o mês e o ano quando coincidem:

```text
12 de outubro de 2024                              (um dia)
12 e 13 de outubro de 2024                         (mesmo mês)
30 de setembro a 2 de outubro de 2024              (mesmo ano)
```

---

## Eventos cancelados — IMPLEMENTADO

`cancelado: true` marca o evento como cancelado na listagem e na página, e define
`eventStatus: 'https://schema.org/EventCancelled'` no JSON-LD.

**Um evento realizado nunca deve ser apagado**, e um evento cancelado também não: o arquivo
de eventos é parte da história da associação.

---

## Arquivo — IMPLEMENTADO

Não há arquivo separado nem movimentação de ficheiros: `/eventos/` mostra as duas listas
(futuros e passados) a partir da mesma coleção, e `/arquivo/` junta notícias, artigos
técnicos e eventos por ano, com filtro no cliente.

---

## Mapa do evento — IMPLEMENTADO

A página do evento só mostra mapa quando `coordenadas` está preenchido. Ao contrário dos
repetidores, **não há posição aproximada a partir de uma quadrícula para eventos**: sem
coordenadas reais, não há mapa. Foi uma decisão deliberada — inventar uma posição
aproximada para um local de encontro seria pior do que não mostrar mapa nenhum.

---

## Inscrições e ligações externas — PARCIALMENTE IMPLEMENTADO

- `inscricoes` é **texto livre**. **Não existe formulário de inscrição, nem backend, nem
  contagem de inscritos.** O campo serve para instruções ou para uma ligação de contacto.
  Descrever o sítio como tendo «inscrições em eventos» seria incorreto.
- `ligacaoExterna` aponta para uma página externa relacionada. Para eventos organizados por
  terceiros que a ARLA apenas divulga, use também `tipo: divulgacao` e preencha
  `organizador`.

---

## Dados estruturados — IMPLEMENTADO

Cada página de evento emite JSON-LD `Event` com `name`, `description`, `startDate`,
`endDate` (usa `inicio` quando não há `fim`), `eventStatus`, `eventAttendanceMode`
(`OfflineEventAttendanceMode`), `inLanguage`, `image` quando existe, `location`
(`Place`, com `geo` apenas se houver `coordenadas`), `organizer` (o `organizador`, ou a
ARLA) e `mainEntityOfPage`.

> **Detalhe a conhecer.** O mapa `ESTADO_SCHEMA` em `eventos/[...slug].astro` devolve
> `EventScheduled` para os três estados; só `cancelado: true` produz `EventCancelled`. Não
> é um erro — o schema.org não tem um estado «terminado» —, mas é a razão pela qual o
> `eventStatus` não varia com o estado calculado.

---

## Acrescentar e alterar um evento

### Pelo CMS

`/admin/` → **Eventos e atividades → New Evento**. Os campos trazem indicações em português,
incluindo o aviso de que as coordenadas só devem ser preenchidas se forem reais.

### Diretamente em Git

1. Criar `src/content/eventos/nome-do-evento.md` (o nome do ficheiro passa a ser o slug).
2. Preencher pelo menos `titulo`, `resumo`, `data` e `inicio`.
3. `npm run build` — a falta de `inicio` produz `[InvalidContentEntryDataError] eventos →
   … inicio: Required`.

**Alterar:** edite o frontmatter ou o corpo. O estado (programado / a decorrer / terminado)
atualiza-se sozinho no build seguinte — não há campo para alternar.
