# Events

## Data source and schema

`src/content/eventos/*.md` (17 entries), schema in `src/content.config.ts` extends `baseArtigo` (see [Articles and News](Articles-and-News#shared-base-schema-basearticle)) with:

```ts
{
  ...baseArtigo,
  inicio: z.coerce.date(),                    // required
  fim: z.coerce.date().optional(),
  dataTexto: z.string().optional(),            // free-text override, e.g. "Todos os domingos de julho"
  horaInicio: z.string().optional(),
  horaFim: z.string().optional(),
  local: z.string().optional(),
  coordenadas: z.object({ lat: z.number(), lon: z.number() }).optional(),
  organizador: z.string().optional(),
  inscricoes: z.string().optional(),
  ligacaoExterna: z.string().optional(),
  tipo: z.enum(['atividade', 'workshop', 'concurso', 'encontro', 'divulgacao']).default('atividade'),
  cancelado: z.boolean().default(false),
}
```

## Date handling and status logic

`estadoEvento(inicio, fim, agora = new Date())` in `src/lib/sitio.ts` is the single source of truth for whether an event is upcoming, ongoing, or past:

```ts
export function estadoEvento(inicio: Date, fim?: Date, agora = new Date()): EstadoEvento {
  const dia = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const hoje = Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate());
  const i = dia(inicio);
  const f = fim ? dia(fim) : i;
  if (hoje < i) return 'futuro';
  if (hoje > f) return 'terminado';
  return 'adecorrer';
}
```

It compares **whole UTC calendar days**, not timestamps — an event starting and ending "today" is `adecorrer` (ongoing) for the entire day regardless of time zone or hour. Labels shown in the UI: `futuro` → "Brevemente", `adecorrer` → "A decorrer", `terminado` → "Terminado".

`src/lib/conteudo.ts` builds on this:
- `eventosFuturos()` — entries not yet `terminado`, sorted by `inicio` ascending (soonest first).
- `eventosPassados()` — entries that are `terminado`, via the collection's default (descending) sort.

**Nothing needs to be manually moved between "upcoming" and "past".** The classification is computed fresh on every build from today's date — an event doesn't need editing when it ends, it simply falls out of `eventosFuturos()` and into `eventosPassados()` on the next build.

## `dataTexto` — for approximate/recurring dates

When an event doesn't have a single clean date — e.g. "every Sunday in July 2023, 21:00–22:00" — `dataTexto` holds that free text and **replaces the formatted `inicio`/`fim` date wherever the event's date would normally be shown**. `inicio` is still required by the schema (it drives sort order and upcoming/past status), but the displayed text becomes whatever `dataTexto` says.

## Event pages

`src/pages/eventos/[...slug].astro` generates one page per entry (slug = filename, same convention as news/articles — see [Routing](Routing)), rendering the Markdown body plus the structured fields: dates (or `dataTexto`), times, location, type, organizer, registration info, and — if `coordenadas` is set — a map via `Mapa.astro`.

## Location and maps

`local` is free text (e.g. "Parque de Merendas do Centro de Interpretação da Mata dos Medos"). A map is only rendered **if `coordenadas` is explicitly set** — the schema deliberately does not fall back to a Maidenhead-grid approximation for events the way repeaters/beacons do (see [Repeater Data](Repeater-Data#map-placement)), because event locations are places people need to actually arrive at, not general station coverage areas. If coordinates aren't known, no map is shown rather than an approximate/wrong one.

## Images

Same mechanism as news/technical articles: `imagem` + `imagemAlt` in frontmatter, served from `public/imagens/conteudo/`.

## External links and organizers

- `ligacaoExterna` — a related external page or resource.
- `organizador` — credits a non-ARLA organizer; leave blank if ARLA itself is organizing. Events organized by third parties that ARLA is merely promoting should use `tipo: divulgacao`.
- `inscricoes` — free text for registration instructions or a contact/link; there is **no registration form or backend** in this project — it's informational only.

## Cancellation

Set `cancelado: true` rather than deleting or unpublishing a cancelled event — the page continues to exist, marked as cancelled, preserving the record that it was scheduled.

## Adding an event — step by step

1. Create `src/content/eventos/nome-do-evento.md`.
2. Minimal frontmatter:
   ```yaml
   ---
   titulo: "Workshop de Construção de Antenas"
   resumo: "Sessão prática de construção de antenas para VHF/UHF, aberta a associados e visitantes."
   data: "2026-09-20"
   inicio: "2026-10-15"
   tipo: "workshop"
   categoria: "Formação"
   etiquetas: []
   ---

   Corpo do evento, em Markdown.
   ```
3. `npm run build`/`npm run check` validates it — `inicio` is the one event-specific required field.
4. Equivalent CMS path: `/admin/` → **Eventos e atividades → New Evento**.

**Never delete a past event.** The events archive is treated as part of the association's public history (per `docs/gestao-de-conteudos.md`) — if something needs correcting, edit the entry or mark it `cancelado`, don't remove the record.
