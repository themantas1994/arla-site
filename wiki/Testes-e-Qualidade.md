# Testes e Qualidade

A verificação é feita por doze ferramentas, todas presentes no repositório e todas
executadas também em integração contínua, a cada *push* e *pull request* (ver
[CI/CD](CI-CD.md)).

---

## As ferramentas

| Ferramenta | Objetivo | Comando | O que verifica |
| --- | --- | --- | --- |
| `astro check` (`@astrojs/check` + TypeScript) | Tipos | `npm run check` | Erros de tipo em `.astro` e `.ts`, com `astro/tsconfigs/strict` |
| **Vitest** | Lógica pura | `npm test` | 58 testes unitários sobre `src/lib/` — ver abaixo |
| `scripts/validar-dados.mjs` (Zod) | Dados | `npm run validar:dados` | Os 5 JSON fora das coleções, com esquemas `strict`. Corre **dentro do `npm run build`** |
| `scripts/validar-esquemas.mjs` | CMS ↔ conteúdo | `npm run validar:esquemas` | Campos, obrigatoriedade e valores de `select` do Decap contra `src/content.config.ts`; avisa se a branch do CMS não existir |
| `scripts/validar-redirecoes.mjs` | Redireções | `npm run redirecoes:validar` | 191 regras coerentes nos três ficheiros; ciclos, cadeias, duplicados, destinos inexistentes |
| `scripts/validar-documentos.mjs` | Documentos | `npm run validar:documentos` | Cada PDF existe e o tamanho publicado corresponde ao ficheiro |
| `scripts/qa.mjs` (Playwright + `@axe-core/playwright`) | Acessibilidade, responsivo, funcional | `npm run qa` | axe-core em 37 páginas × 2 temas; transbordo em 7 larguras; alvos de toque; erros de consola; 17 testes funcionais |
| `scripts/capturas.mjs` (Playwright) | Revisão visual | `npm run qa:capturas` | Gera capturas em `reports/capturas/` |
| `scripts/check-links.mjs` | Ligações | `npm run lint:links` | Ligações internas, âncoras e, com `-- --externas`, ligações externas |
| `scripts/auditar-seo.mjs` | SEO | `npm run audit:seo` | Metadados, JSON-LD, hierarquia de títulos, sitemap, `robots.txt`, textos alternativos |
| `scripts/auditar-desempenho.mjs` (Playwright) | Desempenho | `npm run audit:desempenho` | LCP, FCP, CLS, peso, pedidos e nós do DOM sob 4G lento |
| `scripts/auditar-csp.mjs` (Playwright) | Segurança | `npm run audit:csp` | Aplica a CSP em modo impositivo em 15 páginas e conta violações |

Atalho para tudo o que não precisa de navegador:

```bash
npm run validar    # check + redirecoes + esquemas + dados + documentos + test
```

Não há linter de código (sem ESLint, sem Prettier). O `npm run check` é o equivalente mais
próximo.

---

## Testes unitários

**58 testes, 3 ficheiros.** Motor: Vitest, configurado em `vitest.config.ts`.

```text
tests/
├── duplos/astro-content.ts   duplo de `astro:content` (ver abaixo)
├── maidenhead.test.ts        quadriculaParaCoordenadas, formatarCoordenadas
├── sitio.test.ts             estadoEvento, intervaloDatas, tempoLeitura, normalizar
└── conteudo.test.ts          slugCategoria, relacionados, textoSimples
```

Cobrem só **lógica pura** — funções sem I/O, sem Astro, sem DOM. Os casos limite valem mais
do que os normais e é isso que os testes privilegiam: quadrículas Maidenhead inválidas,
eventos no primeiro e no último dia, um evento cujo fim é anterior ao início, listas vazias
e de um só elemento, texto vazio e texto muito longo, categorias com pontuação.

**Como funcionam sem o Astro.** `src/lib/conteudo.ts` importa `astro:content`, um módulo
virtual que só existe durante o build. O `vitest.config.ts` resolve-o para
`tests/duplos/astro-content.ts`, que fornece os tipos e faz `getCollection()` lançar uma
mensagem explícita. Se um teste precisar de coleções, é sinal de que devia ser um teste
funcional em `npm run qa`, não um teste unitário.

O `vitest.config.ts` replica também os *aliases* do `tsconfig.json` (`@lib`, `@data`, …).
Ao acrescentar um alias novo, acrescente-o nos dois sítios.

---

## O que cada um precisa

| Comando | Precisa de `dist/`? | Precisa de servidor? |
| --- | --- | --- |
| `npm run check` | Não | Não |
| `npm test` | Não | Não |
| `npm run validar:dados` | Não | Não |
| `npm run validar:esquemas` | Não | Não |
| `npm run redirecoes:validar` | Não | Não |
| `npm run validar:documentos` | Não | Não |
| `npm run lint:links` | **Sim** | Não (lê ficheiros) |
| `npm run audit:seo` | **Sim** | Não (lê ficheiros) |
| `npm run qa` | Sim | **Sim** (`npm run preview`) |
| `npm run qa:capturas` | Sim | **Sim** |
| `npm run audit:desempenho` | Sim | **Sim** |
| `npm run audit:csp` | Sim | **Sim** |

Sequência completa:

```bash
npm run check
npm run build
npm run preview &
npm run lint:links
npm run qa
npm run audit:seo
npm run audit:desempenho
```

Os guiões que abrem o navegador usam `/opt/pw-browsers/chromium` quando esse binário existe,
e respeitam `CHROMIUM_PATH`; os que se ligam ao servidor aceitam `--url`.

---

## `astro check`

```bash
npm run check
```

Última execução: **70 ficheiros, 0 erros, 0 avisos, 8 sugestões** (`hints`). As sugestões são
importações não usadas e variáveis desnecessárias — não bloqueiam e estão registadas na
[auditoria](../docs/auditoria-do-projeto.md#dívida-técnica).

O projeto usa `astro/tsconfigs/strict` com `strictNullChecks` e **não tem supressões**
(`@ts-ignore`, `@ts-expect-error`) configuradas: um erro de tipo aponta normalmente para uma
divergência real entre o esquema e a forma como uma página o consome.

---

## `npm run qa`

`scripts/qa.mjs` (427 linhas) faz quatro coisas num único Chromium:

### 1. Acessibilidade

axe-core, com os conjuntos de regras `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`
e `best-practice`, sobre **37 páginas** nos dois temas — 74 análises. Última execução:
**0 violações**.

### 2. Responsivo

As mesmas páginas a 320, 375, 390, 768, 1024, 1280 e 1440 px, à procura de transbordo
horizontal. Última execução: **nenhum**.

### 3. Alvos de toque

A 375 px, procura controlos com menos de 24 px. Última execução: **nenhum**.

### 4. Funcional

17 testes num navegador real, sobre o build de produção. Na última execução, todos passaram:

| Teste | Resultado |
| --- | --- |
| Filtro de repetidores por banda (UHF) | 9 → 5 linhas |
| Pesquisa de repetidores sem acentos | «arrabida» → 4 resultados |
| Estado vazio dos filtros | Mensagem apresentada |
| Botão de copiar frequência | Valor correto na área de transferência |
| Pesquisa do sítio (Pagefind) | 25 resultados para «repetidor» |
| Pesquisa sem acentos | «satelite» → 25 resultados |
| Pesquisa sem resultados | Estado vazio apresentado |
| Menu para ecrãs pequenos | Abre, expande secção e fecha |
| Submenu por teclado | Enter abre, Escape fecha, `aria-expanded` correto |
| Alternância de tema | Persiste após recarregar |
| Mapa (Leaflet + OpenStreetMap) | Inicializa, com marcadores |
| Filtro do arquivo | 64 → 4 itens |
| Filtro de associados sem acentos | «monica» encontra «Mónica» |
| Descarregamento de PDF | 109 kB, `application/pdf` |
| Índice de artigo longo | 7 entradas |
| Redireção do sítio antigo | `/site/repetidores/` → `/rede/repetidores/` |
| Página 404 | Mensagem, pesquisa e atalhos |

O relatório completo fica em `reports/qa.json`.

### Erros de consola

A secção de erros de consola acusa `net::ERR_TOO_MANY_RETRIES` nas páginas com mapa e na de
meteorologia espacial quando o ambiente bloqueia pedidos externos (telas do OpenStreetMap,
painéis do HamQSL). **Não são erros do sítio**: nenhum erro de JavaScript próprio foi
registado. O número varia com o ambiente — sete na medição original, cinco na reverificação
de setembro de 2026 —, o que é em si o indício de que a causa é externa.

---

## `npm run lint:links`

`scripts/check-links.mjs` analisa os **296 ficheiros HTML** de `dist/`:

- **ligações internas** resolvidas contra os ficheiros gerados (tenta `caminho/index.html`,
  `caminho` e `caminho.html`);
- **âncoras** (`#id`) verificadas contra os `id` existentes na página de destino;
- **ligações externas** apenas com `-- --externas`: HEAD, com GET de reserva e concorrência
  limitada.

A origem própria (`PUBLIC_SITE_URL`, ou `https://www.cs5arla.pt`) não é tratada como
externa, para que os canónicos e o Open Graph não sejam testados como ligações de terceiros.

Última execução: **5314 ligações internas e 146 âncoras, 0 partidas**; 58 ligações externas
distintas em 177 ocorrências.

Sobre as ligações externas que não respondem, ver
[`docs/qualidade.md`](../docs/qualidade.md#ligações): 14 delas estão dentro de artigos
migrados e já estavam mortas no sítio anterior. **Não são corrigidas de propósito** —
reescrever ligações dentro de um texto histórico seria alterar o registo do que a ARLA
publicou na altura. Duas outras (ANACOM, Facebook) devolvem 403/400 a pedidos automatizados
mas funcionam num navegador real: são inconclusivas, não partidas.

---

## `npm run audit:seo`

`scripts/auditar-seo.mjs` ignora as páginas-stub de redireção e `/admin/`, e verifica
`<title>`, descrição, canónico, Open Graph, `lang`, hierarquia de títulos, JSON-LD e o
sitemap. Última execução: **112 páginas analisadas (4 com `noindex`), 0 problemas, 9 avisos**
de título longo — nomes de eventos que são mesmo compridos e que encurtar distorceria.

Detalhe em [SEO](SEO.md).

---

## `npm run audit:desempenho`

`scripts/auditar-desempenho.mjs` mede 8 páginas a 390 px, com rede 4G lento (1,6 Mbit/s,
150 ms de latência), CPU 4× mais lento e cache fria, recolhendo LCP e CLS por
`PerformanceObserver`. Última execução: **todas as páginas dentro dos limiares de Core Web
Vitals**, com LCP entre 472 e 656 ms e CLS a zero.

Detalhe em [Desempenho](Desempenho.md).

---

## Antes de submeter uma alteração

```bash
npm run check
npm run build
npm run preview &
npm run lint:links
npm run qa          # para qualquer alteração de UI, conteúdo ou acessibilidade
```

Nada disto corre automaticamente. **Se não correr estes comandos, ninguém os corre por si.**

---

## Limites destas verificações

Por honestidade, o que fica de fora:

- **Os testes unitários cobrem `src/lib/`, e mais nada.** Os componentes `.astro`, os
  layouts e as páginas não têm testes unitários — são cobertos pelos 17 testes funcionais
  do `npm run qa`, que correm num navegador real.
- **Leitores de ecrã reais** (NVDA, VoiceOver) não foram usados. O axe-core verifica
  estrutura, não experiência.
- **Só Chromium.** Safari e Firefox não foram testados.
- **Só emulação**, sem dispositivos físicos.
- **O CMS em produção** não foi testado, porque a autenticação OAuth ainda não existe e a
  branch publicada está por decidir. O que é verificável sem ele — a coerência do
  `config.yml` com os esquemas — é verificado por `npm run validar:esquemas`.
- **O `.htaccess` não é executado por nenhum Apache.** As regras geradas são verificadas
  por concordância entre ficheiros, não em funcionamento.
- **A CSP está em `Report-Only`.** É testada em modo impositivo num navegador, mas não está
  imposta em produção — ver [`docs/seguranca-csp.md`](../docs/seguranca-csp.md).
- **Carga** não foi medida — pouco relevante num sítio estático.

Ver [Acessibilidade](Acessibilidade.md) e
[`docs/qualidade.md`](../docs/qualidade.md#o-que-não-foi-testado).
