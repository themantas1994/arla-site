# Repeater Data

The repeater/beacon directory is one of the site's most-used features — it's the technical reference members actually tune radios by. This page documents the real data model, exactly as defined in `src/content.config.ts` and consumed by `src/components/TabelaRepetidores.astro` and `src/components/Mapa.astro`.

## Where the data lives

| Collection | File | Schema location |
| --- | --- | --- |
| `repetidores` | `src/data/repetidores.json` | `src/content.config.ts` |
| `balizas` | `src/data/balizas.json` | `src/content.config.ts` |

Both are edited via `/admin/` → **Rede ARLA → Repetidores** / **Balizas** (a single-file, list-of-objects CMS collection — see `public/admin/config.yml`, `name: rede`), or directly in the JSON.

## Repeater schema (exact, from `content.config.ts`)

```ts
z.object({
  id: z.string(),                                        // unique slug, e.g. "cq0vstc"
  canal: z.string().optional(),                           // e.g. "RV56"
  banda: z.enum(['VHF', 'UHF', 'SHF', 'HF']),
  modo: z.string(),                                       // free text: "Analógico", "Digital DMR"…
  filtros: z.array(z.string()).default([]),                // e.g. ["vhf", "analogico"]
  localizacao: z.string(),
  quadricula: z.string().optional(),                       // Maidenhead locator, e.g. "IM57px"
  coordenadas: z.object({ lat: z.number(), lon: z.number() }).optional(),
  frequenciaTx: z.string(),
  frequenciaRx: z.string(),
  tom: z.string().optional(),
  acesso: z.string().optional(),                            // CTCSS tone / DMR talkgroup+color code / reflector
  potencia: z.string().optional(),
  indicativo: z.string(),                                    // callsign
  estado: z.enum(['operacional', 'manutencao', 'indisponivel', 'desconhecido']),
  notas: z.string().optional(),
})
```

## Beacon schema

```ts
z.object({
  id: z.string(),
  banda: z.string(),                 // free text here, not an enum (e.g. "VHF 144 MHz")
  localizacao: z.string(),
  quadricula: z.string().optional(),
  coordenadas: z.object({ lat: z.number(), lon: z.number() }).optional(),
  frequencia: z.string(),
  modo: z.string(),
  potencia: z.string().optional(),
  indicativo: z.string(),
  antena: z.string().optional(),
  estado: z.enum(['operacional', 'manutencao', 'indisponivel', 'desconhecido']),
  notas: z.string().optional(),
})
```

Note `banda` is a free-text string for beacons but a closed enum (`VHF`/`UHF`/`SHF`/`HF`) for repeaters — that's a real, intentional difference in the two schemas, not an inconsistency to "fix".

## Real example (from `src/data/repetidores.json`)

```json
{
  "id": "cq0vstc",
  "canal": "RV56",
  "banda": "VHF",
  "modo": "Analógico",
  "filtros": ["vhf", "analogico"],
  "localizacao": "Aldeia dos Chãos",
  "quadricula": "IM57px",
  "frequenciaTx": "145.7000",
  "frequenciaRx": "145.1000",
  "tom": "74.4 Hz",
  "acesso": "74.4 Hz",
  "potencia": "20",
  "indicativo": "CQ0VSTC",
  "estado": "operacional"
}
```

## Filtering and search (`TabelaRepetidores.astro`)

Both live entirely client-side, in a `<script>` block scoped to the component — no framework, no external library:

- **Text search** matches against a precomputed string per row (`data-texto`, built from channel, band, mode, location, grid square, frequencies, and callsign), with accents stripped on both sides of the comparison (`normalize('NFD')`) so "Arrabida" matches "Arrábida".
- **Filter checkboxes** come from the `filtros` array on each entry and the `FILTROS` constant in the component (`vhf`, `uhf`, `analogico`, `dmr`, `dstar`, `aprs`) — only filter buttons that actually match at least one loaded entry are rendered (`filtrosVisiveis`). Filters are grouped: band values (`vhf`/`uhf`) are OR'd together, mode values are OR'd together, and the two groups are AND'd — so checking "VHF" and "DMR" shows VHF DMR repeaters, not all VHF *or* all DMR.
- An empty-state message (`EstadoVazio.astro`) appears when no row matches, and a live-region count (`aria-live="polite"`) announces how many results remain.

**If you add a repeater and forget to set `filtros` correctly**, it will still appear in the unfiltered table (and its own card on mobile) but silently vanish the moment someone applies any filter — this is the most common real mistake when adding an entry.

## Map placement (`src/lib/maidenhead.ts` + `Mapa.astro`)

- If `coordenadas` (`{ lat, lon }`) is set, that's used directly and treated as exact.
- Otherwise, if `quadricula` is set, `quadriculaParaCoordenadas()` converts the Maidenhead locator to the **center of the grid square** (sub-square center for a 6-character locator, ±4km; 2°×1° square center for a 4-character locator, ±60km) and returns a `precisaoKm` uncertainty radius.
- The map and each marker's popup **explicitly label grid-derived positions as approximate** — this is a deliberate accuracy commitment documented in `docs/arquitetura.md`: the association publishes grid locators, not exact coordinates, and the UI never claims more precision than the source data has.
- No coverage polygons are ever drawn — there's no verified coverage-study data to draw them from.

## Status field (`estado`)

One of `operacional` / `manutencao` / `indisponivel` / `desconhecido`, rendered by `DistintivoEstado.astro` as a badge combining a symbol and text (never color alone — see [Accessibility](Accessibility)). The same field drives the badge everywhere it appears: the full table, the mobile card view, the homepage's network snapshot, and any other listing — there is exactly one source of truth per repeater.

## Adding a repeater

**Via the CMS:** `/admin/` → **Rede ARLA → Repetidores → Add Repetidor**, fill in the form. Fields to get right:
- `id` — lowercase, no spaces/accents, must be unique across the collection; usually the callsign lowercased (`cq0varb`).
- `filtros` — pick every band/mode tag that applies, or the repeater will disappear under filtering (see above).
- `quadricula` — needed for the repeater to show up on the map at all, unless `coordenadas` is also filled in.

**Directly in Git:** add an object to the `repetidores` array in `src/data/repetidores.json` matching the schema above, then run `npm run build` (or `npm run check`) to confirm it validates.

## Editing / changing status

Update the relevant field(s) via the CMS or directly in JSON. Changing `estado` is the most common edit — use `notas` to explain context (e.g. "Fora de serviço por avaria na fonte de alimentação" — down due to a power-supply fault). The change appears everywhere the collection is rendered on the next build; there's no separate cache or secondary copy to update.

## Removing / archiving

There is **no archived state** for repeaters/beacons — a decommissioned station is either:
- Removed entirely from the JSON array, or
- Kept with `estado: "indisponivel"` and a note, if the association wants to keep publishing the historical record.

Unlike news/events, there's no `historico` flag on this schema — the concept doesn't currently exist for network infrastructure entries.

## Validation

Enforced by Zod at build/dev time. A `npm run build` failure here looks like:

```
[InvalidContentEntryDataError] repetidores → cq0novo
  frequenciaTx: Required
```

Required fields: `id`, `banda` (must be one of the enum values), `modo`, `localizacao`, `frequenciaTx`, `frequenciaRx`, `indicativo`, `estado` (must be one of the enum values). Everything else is optional.
