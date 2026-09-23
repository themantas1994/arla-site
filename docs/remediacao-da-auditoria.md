# Remediação da auditoria

Correção das pendências técnicas identificadas na
[auditoria do projeto](auditoria-do-projeto.md) de **20 de setembro de 2026**
(commit de referência `a723a81`).

Trabalho feito a **21 de setembro de 2026**, sobre o commit `e67e616`.

**O que isto não é:** não houve redesenho, não se alterou o aspeto do sítio, e **não se
mexeu num único dado da associação** — nem frequências, nem indicativos, nem nomes, nem
quotas, nem o IBAN, nem documentos legais, nem factos históricos.

---

## Resumo

Das 14 entradas de dívida técnica, 2 defeitos e 3 pendências de configuração que a auditoria
deixou por resolver:

```text
CORRIGIDAS .................. 17
EXIGEM DECISÃO DA DIREÇÃO ....  5
ADIADAS ......................  2
```

O que mudou, em três linhas:

1. **Deixou de haver conhecimento duplicado sem verificação.** As redireções passaram a ter
   uma fonte única que gera os ficheiros de servidor; o CMS, os dados JSON, os documentos e
   a Content-Security-Policy passaram a ser verificados automaticamente.
2. **Passou a haver rede de segurança.** 58 testes unitários sobre a lógica pura, e
   integração contínua que corre tudo a cada alteração — sem publicar nada.
3. **A segurança subiu onde era possível subir sem risco.** Uma vulnerabilidade alta
   corrigida, o editor do CMS fixado com Subresource Integrity, e uma CSP em `Report-Only`
   já testada em modo impositivo.

O que **não** mudou, de propósito: as decisões que pertencem à direção da associação. Estão
todas em [`decisoes-pendentes.md`](decisoes-pendentes.md), e nenhuma foi inventada para o
projeto parecer completo.

---

## Antes

| | |
| --- | --- |
| Redireções | 3 ficheiros mantidos à mão, sem geração nem verificação; catch-all com comportamento diferente entre Apache e Netlify |
| Testes unitários | Nenhum |
| Integração contínua | Nenhuma (`.github/` não existia) |
| Validação dos dados JSON fora das coleções | Nenhuma — um campo mal escrito dava `undefined` na página |
| CMS ↔ esquemas de conteúdo | Sem verificação; o CMS podia gravar o que o build recusa |
| `npm audit` | 3 vulnerabilidades (1 crítica, 1 alta, 1 baixa) |
| Content-Security-Policy | Inexistente |
| Editor do CMS | `decap-cms@^3.8.4` do unpkg, sem Subresource Integrity |
| `robots.txt` | Estático, com o endereço do sitemap escrito literalmente |
| `astro check` | 0 erros, 0 avisos, **8 sugestões** |
| Media | `hamRadio.mp4` e `hamradio.mp4`, byte a byte iguais |
| Breakpoints das tabelas | `.so-largo`/`.so-estreito` repetidos em 3 ficheiros |
| Defeitos conhecidos | BUG-001 e BUG-002 por corrigir |

## Depois

| | |
| --- | --- |
| Redireções | `src/lib/redirects.mjs` é fonte única; 191 regras geradas nos dois ficheiros de servidor; validador com 8 classes de erro |
| Testes unitários | **58**, em 3 ficheiros (Vitest) |
| Integração contínua | `.github/workflows/qualidade.yml`, 2 trabalhos, 12 verificações — **sem publicação** |
| Validação dos dados JSON | 5 ficheiros com esquemas Zod `strict`, a correr **dentro do `npm run build`** |
| CMS ↔ esquemas | `npm run validar:esquemas`, 9 coleções comparadas a cada alteração |
| `npm audit` | **2** vulnerabilidades (1 crítica, 1 baixa) — ambas dependem de uma migração do Astro |
| Content-Security-Policy | `Report-Only` no `.htaccess`, testada em modo impositivo: 15 páginas, 0 violações |
| Editor do CMS | `decap-cms@3.16.2` com `integrity` e `crossorigin`, verificado em teste |
| `robots.txt` | Gerado no build, acompanha `PUBLIC_SITE_URL` |
| `astro check` | 0 erros, 0 avisos, **1 sugestão** (intencional e documentada) |
| Media | Só `hamradio.mp4`, com 301 do nome antigo |
| Breakpoints das tabelas | Definidos uma vez em `global.css`, escolhidos por sufixo de classe |
| Defeitos conhecidos | BUG-001 e BUG-002 corrigidos |

---

## Correções aplicadas

### DOC-001 — Repositório no Decap CMS

**Severidade:** Crítica · **Estado: JÁ ESTAVA CORRIGIDO**

**Problema.** A auditoria reportou `repo: themantas1994/arla` (repositório inexistente).

**Verificação.** `public/admin/config.yml` já tinha `repo: themantas1994/arla-site`, o valor
certo, corrigido pela própria auditoria. **Nada foi alterado.** Ficou uma verificação
automática dos caminhos do CMS em `npm run validar:esquemas`.

---

### DOC-017 — Endereço do sitemap no robots.txt

**Severidade:** Baixa · **Ficheiros:** `src/pages/robots.txt.ts` (novo), `public/robots.txt` (removido)

**Problema.** O `robots.txt` era estático, com `https://www.cs5arla.pt/sitemap-index.xml`
escrito literalmente. Em qualquer domínio que não fosse o de produção — uma
pré-visualização, um domínio novo — apontava os motores de busca para o sítio errado.

**Solução.** Passou a ser um endpoint gerado no build, que deriva o endereço de
`Astro.site`, ou seja, de `PUBLIC_SITE_URL`. As áreas bloqueadas ficaram numa constante
`BLOQUEADAS` no topo do ficheiro, com a nota de que têm de coincidir com o filtro do
sitemap.

**Validação.**

```bash
npm run build && cat dist/robots.txt
# Sitemap: https://www.cs5arla.pt/sitemap-index.xml
PUBLIC_SITE_URL=https://teste.exemplo.pt npx astro build && cat dist/robots.txt
# Sitemap: https://teste.exemplo.pt/sitemap-index.xml
```

`/admin/` e `/area-reservada/` continuam bloqueados; `npm run audit:seo` confirma.

---

### DOC-018 — CHROMIUM_PATH por documentar

**Severidade:** Baixa · **Ficheiros:** `README.md`, `wiki/Variaveis-de-Ambiente.md`

**Problema.** A variável era usada por três guiões e não constava da tabela de variáveis de
ambiente.

**Solução.** Documentada nos dois sítios, com a cadeia de resolução explícita — variável,
depois `/opt/pw-browsers/chromium`, depois o navegador do Playwright — e uma tabela de
**quando é preciso defini-la**: numa máquina normal e em integração contínua, não é.
Fica dito que `/opt/pw-browsers/chromium` é o caminho de um ambiente concreto e não um
caminho universal, e que não deve ser escrito em nenhum ficheiro do repositório.

---

### DT-001 — Redireções em três ficheiros sem geração

**Severidade:** Alta · **Ficheiros:** `src/lib/redirects.mjs`, `scripts/lib/redirecoes.mjs`, `scripts/gerar-redirecoes.mjs`, `scripts/validar-redirecoes.mjs`, `public/.htaccess`, `public/_redirects`

**Problema.** 183 redireções de rota, 190 regras em cada ficheiro de servidor, tudo mantido
à mão. Uma redireção acrescentada só num ficheiro comportava-se de forma diferente conforme
o alojamento.

**Solução.** `src/lib/redirects.mjs` passou a ser a fonte única, com três exportações:

| Exportação | Regras | Vai para |
| --- | --- | --- |
| `redirects` | 183 | `astro.config.mjs` + ficheiros de servidor |
| `redirecoesDeFicheiros` | 7 | só ficheiros de servidor (uma entrada em `redirects` faria o Astro gerar um `.html` no lugar do PDF) |
| `capturaFinal` | 1 | sempre em último lugar |

`npm run redirecoes:gerar` escreve `public/_redirects` por inteiro e, no `.htaccess`,
**apenas o bloco entre marcadores** — os cabeçalhos de segurança, as regras de cache, a CSP
e o `ErrorDocument` ficam intactos, e a geração falha com uma mensagem se os marcadores
desaparecerem.

**Um defeito real encontrado pelo caminho.** Os dois ficheiros faziam coisas diferentes na
regra de recolha: `_redirects` tinha `/site/*`, que apanha tudo, e o `.htaccess` tinha
`^site/?$`, que só apanhava `/site/` e `/site`. No alojamento Apache atual,
`/site/pagina-que-ja-nao-existe/` dava 404 em vez de ir para a página inicial, ao contrário
do que o comentário do próprio ficheiro afirmava. Corrigido para `^site(/|$)`.
Os padrões dos ficheiros passaram também a escapar os metacaracteres de regex
(`^estatutos_arla\.pdf$` em vez de `^estatutos_arla.pdf$`).

`npm run redirecoes:validar` deteta: regras em falta, a mais ou com destino diferente entre
os três ficheiros; origens duplicadas; auto-redireções; ciclos; cadeias; origens e destinos
mal formados; códigos de estado inválidos; destinos de ficheiro inexistentes em `public/`;
e o desaparecimento das secções do `.htaccess` mantidas à mão.

**Validação.** 191 regras coerentes nos três ficheiros, sem ciclos nem cadeias.
`npm run lint:links` sem ligações partidas; o teste funcional confirma `/site/repetidores/`
→ `/rede/repetidores/`.

---

### DT-002 — CMS e esquemas de conteúdo sem verificação

**Severidade:** Alta · **Ficheiros:** `scripts/validar-esquemas.mjs` (novo)

**Problema.** `public/admin/config.yml` e `src/content.config.ts` descreviam os mesmos dados
sem nada a garantir que concordavam. O CMS podia gravar conteúdo que o build recusa, e quem
editou só descobria quando o sítio deixava de compilar.

**Solução.** Verificação automática das 9 coleções. Falha quando encontra campos
obrigatórios do esquema ausentes do CMS, campos obrigatórios no esquema mas opcionais no
CMS, campos que o CMS grava e o esquema não conhece, valores de `select` fora do `z.enum()`
correspondente, coleções sem correspondência, ou caminhos de media alterados. Avisa quando o
esquema aceita um campo que o CMS não oferece.

Não se carrega `src/content.config.ts` como módulo — depende de `astro:content`, que só
existe durante o build —, pelo que é analisado por texto, com um leitor de chaves
equilibradas. É deliberadamente conservador: na dúvida, não acusa.

**Validação.** Além de passar sobre a configuração real, foi testado contra quatro
divergências injetadas de propósito e **apanhou as quatro**: um valor de enum inexistente
(`nivel: perito`), um campo obrigatório tornado opcional (`titulo`), um campo desconhecido
pelo esquema (`patrocinador`) e uma banda fora do enum dos repetidores (`EHF`). A
configuração foi reposta na íntegra a seguir.

**Divergências reais encontradas**, registadas como avisos por não partirem nada: `anexos`
nas três coleções editoriais, e `atualizado`, `autor`, `indicativo`, `historico`,
`notaHistorica` e `destaque` nos eventos — campos que o Astro aceita e o editor não expõe.
Não foram corrigidos porque acrescentar campos ao CMS muda o que quem edita vê, e isso não
é uma correção técnica.

---

### DT-003 — Sem testes unitários

**Severidade:** Alta · **Ficheiros:** `vitest.config.ts`, `tests/` (3 ficheiros + 1 duplo)

**Problema.** Nenhuma das funções puras de `src/lib/` tinha teste. Uma regressão só era
apanhada por inspeção visual.

**Solução.** Vitest e **58 testes**, com as seis funções que a auditoria nomeou e mais três
adjacentes:

| Ficheiro | Funções |
| --- | --- |
| `tests/maidenhead.test.ts` | `quadriculaParaCoordenadas()`, `formatarCoordenadas()` |
| `tests/sitio.test.ts` | `estadoEvento()`, `intervaloDatas()`, `tempoLeitura()`, `normalizar()` |
| `tests/conteudo.test.ts` | `slugCategoria()`, `relacionados()`, `textoSimples()` |

Os casos limite valem mais do que os normais e é isso que os testes privilegiam: 10 formas
inválidas de quadrícula Maidenhead, os extremos do sistema (`AA00`, `RR99`), eventos no
primeiro e no último dia, um evento cujo fim é anterior ao início, listas vazias e de um só
elemento, texto vazio e texto de 200 000 palavras, categorias com pontuação e acentos.

`src/lib/conteudo.ts` importa `astro:content`, que só existe durante o build; o
`vitest.config.ts` resolve-o para `tests/duplos/astro-content.ts`, onde `getCollection()`
lança uma mensagem explícita — se um teste precisar de coleções, é sinal de que devia ser
um teste funcional.

**Dois enganos apanhados pelos próprios testes**, ambos nas expectativas e não no código:
a quadrícula da sede é `IM58pa` e não `IM57px`, e um evento com fim anterior ao início passa
de «futuro» a «terminado» sem nunca aparecer como «a decorrer» — comportamento correto, que
o teste passou a fixar.

**Validação.** `npm test` → 3 ficheiros, 58 testes, todos a passar.

---

### DT-004 — Vulnerabilidades em dependências

**Severidade:** Alta · **Ficheiros:** `package.json`, `package-lock.json`

**Problema.** 3 vulnerabilidades: `astro` (crítica), `sharp` (alta), `esbuild` (baixa).

**Solução.** `npm audit fix --force` **não** foi usado. Cada aviso foi analisado à parte:

| Pacote | Havia correção dentro do major atual? | O que se fez |
| --- | --- | --- |
| `sharp` (alta) | Sim, em 0.35.4 | **Corrigido.** `sharp@^0.35.4` mais um `overrides`, porque o Astro declara `sharp` em `optionalDependencies` com `^0.34.0` e sem o override ficariam duas cópias, com a vulnerável instalada |
| `astro` (crítica) | **Não.** O aviso cobre todas as versões até 7.2.7; a correção é `astro@7.3.3` | **Adiado** — ver abaixo |
| `esbuild` (baixa) | Não; chega por `astro` | **Adiado**, com `astro` |

`npm audit`: **3 → 2 vulnerabilidades**.

**Validação do `sharp`.** `npm ls sharp` mostra uma só cópia (0.35.4, deduplicada sob o
Astro). `scripts/otimizar-media.mjs` foi corrido sobre uma amostra de JPEG e PNG e otimizou
as duas imagens. O build completo passa, tal como o resto da suite.

O Vitest instalado foi a versão 5: a 3 traz um `@vitest/mocker` com aviso moderado, e não
faz sentido acrescentar uma vulnerabilidade ao corrigir outras.

---

### DT-005 — `POR_PAGINA = 12` duplicado

**Severidade:** Média · **Ficheiros:** `src/lib/conteudo.ts`, `src/pages/noticias/index.astro`, `src/pages/noticias/pagina/[pagina].astro`

**Problema.** A constante existia em `noticias/index.astro` e em `pagina/[pagina].astro`, e
neste último havia ainda um `12` literal dentro de `getStaticPaths()`. Alterar só um geraria
páginas a mais ou a menos.

**Solução.** `POR_PAGINA` passou a ser exportada de `src/lib/conteudo.ts` e importada nos
dois sítios. Dentro de `getStaticPaths()` é reimportada dinamicamente, porque o Astro avalia
essa função num módulo à parte que não vê as constantes do frontmatter.

**Validação.** `npm run build` gera as mesmas páginas de antes: `/noticias/` mais
`/noticias/pagina/2|3|4/`, com 39 notícias a 12 por página.

---

### DT-006 — Prop `tipoArtigo` nunca lida

**Severidade:** Média · **Ficheiros:** `src/layouts/Artigo.astro` e as 3 páginas de detalhe

**Problema.** `Artigo.astro` declarava `tipoArtigo`, dava-lhe um valor por omissão,
destruturava-a — e nunca a usava. As três páginas de detalhe passavam-na.

**Decisão: remover.** O layout não ramifica por tipo de artigo em lado nenhum, e o que
distingue visualmente os três tipos já vem de outras props (`categoria`, `jsonLd`, o bloco
de informação do evento). Manter a prop seria manter uma promessa que o componente não
cumpre.

**Validação.** Removida dos 4 ficheiros. O `astro check` deixou de a assinalar e as páginas
de notícia, artigo técnico e evento continuam idênticas.

---

### DT-007 — Lógica de capturas duplicada

**Severidade:** Média · **Ficheiros:** `scripts/lib/capturas.mjs` (novo), `scripts/capturas.mjs`, `scripts/qa.mjs`

**Problema.** Duas implementações a divergir: `scripts/capturas.mjs` (16 páginas, 3
viewports, `inteira` por página) e o bloco `--capturas` de `scripts/qa.mjs` (10 páginas,
regras ligeiramente diferentes).

**Solução.** Uma só implementação em `scripts/lib/capturas.mjs`, usada pelos dois. Ficou a
lista mais completa das duas.

**Nenhuma página é largada.** As 10 do `qa.mjs` são um subconjunto das 16, com os mesmos
nomes de ficheiro; as regras de viewport e de tema do `capturas.mjs` são também um
superconjunto das do `qa.mjs`. **A consolidação só acrescenta capturas**, nunca remove.
A única diferença de conteúdo: `artigo-tecnico` passa a fotografar
`/tecnica/qo-100-como-receber/` em vez de `/tecnica/modos-digitais-para-o-qo-100/` — o nome
do ficheiro gerado é o mesmo.

**Validação.** `npm run qa` continua a passar (74 análises axe-core, 17/17 testes
funcionais). Os nomes de ficheiro em `reports/capturas/` mantêm o formato
`<nome>-<ecrã>-<tema>.png`.

---

### DT-008 — Sugestões do `astro check`

**Severidade:** Baixa · **Ficheiros:** 7

**Problema.** 8 sugestões: 7 importações e variáveis por usar, mais um uso de
`document.execCommand`.

**Solução.** As 7 primeiras foram removidas: `tempoLeitura` em `CartaoArtigo.astro`,
`tipoArtigo` em `Artigo.astro` (DT-006), `coordDMS` em `contactos.astro`, `headings` em
`arla/index.astro`, `dataExtenso` em `eventos/[...slug].astro` e `Icone` em
`eventos/index.astro` e `rede/cs5arla.astro`.

Sobre o `coordDMS`: a página mostra `SITIO.coordenadasTexto`, que vem dos dados da
associação. A variável calculava as mesmas coordenadas a partir de `formatarCoordenadas()` e
não era usada — ficou um comentário a dizer porquê. A função continua exportada e agora tem
testes.

**`document.execCommand` foi deixado.** É a alternativa de cópia para navegadores sem
Clipboard API ou em contexto não seguro, e só corre quando a API moderna falha. Ficou um
comentário a marcar a sugestão como **intencional**.

**Validação.** `astro check`: **0 erros, 0 avisos, 1 sugestão** — a intencional e
documentada.

---

### DT-009 — Cinco ficheiros JSON sem validação

**Severidade:** Média · **Ficheiros:** `scripts/validar-dados.mjs` (novo), `package.json`

**Problema.** `sitio`, `orgaos-sociais`, `direcao-tecnica`, `associados` e `cronologia` eram
importados diretamente pelas páginas, fora das coleções de conteúdo. Um erro de digitação
aparecia como `undefined` na página publicada, sem falhar o build.

**Solução escolhida: Opção B** — os ficheiros ficam onde estão, com a arquitetura atual, e
passam a ser validados. Passá-los a coleções com `file()` obrigaria a mexer em todas as
páginas que os leem, nas coleções do CMS e no `content.config.ts`, para obter a mesma
garantia; foi a opção com menos alteração arquitetural desnecessária.

Esquemas Zod **`strict()`** de propósito: um campo a mais é quase sempre um campo mal
escrito. Validam-se também formatos — código postal `0000-000`, IBAN português, quadrícula
Maidenhead, coordenadas dentro do intervalo legítimo, datas `AAAA-MM-DD`, ícones dentro do
conjunto conhecido — e duas coerências entre ficheiros, como avisos: números de associado
dos órgãos sociais ausentes da lista pública, e entradas da cronologia com `data` diferente
de `ordenacao`.

**Corre dentro do `npm run build`**, pelo que um erro impede a publicação em vez de produzir
`undefined`.

**Validação.** Testado contra três erros injetados — `codigoPostal` escrito
`codigopostal`, uma latitude passada a texto, e uma quadrícula inválida — e **apanhou os
três**, com mensagens que dizem onde e porquê. O ficheiro foi reposto e o `git diff` ficou
vazio.

---

### DT-010 — Nomes de media a diferir só em maiúsculas

**Severidade:** Média · **Ficheiros:** `public/imagens/conteudo/hamRadio.mp4` (removido), `src/lib/redirects.mjs`

**Problema.** `hamRadio.mp4` e `hamradio.mp4` no mesmo diretório — ambíguo em sistemas de
ficheiros que ignoram maiúsculas.

**Verificação antes de mexer.** Os dois ficheiros são **byte a byte iguais** (mesmo `md5`,
1 245 949 bytes). Só o minúsculo é referenciado, em
`src/content/paginas/ser-radioamador.md`. O maiúsculo não é referenciado em parte nenhuma
do repositório.

**Solução.** Ficou o minúsculo. Como o maiúsculo estava em `public/` e seria servido em
produção, **acrescentou-se uma redireção 301** de `/imagens/conteudo/hamRadio.mp4` para
`/imagens/conteudo/hamradio.mp4` — por precaução, caso algum endereço tenha circulado.
É uma das 7 regras de ficheiro estático.

**Validação.** `npm run lint:links` sem ligações partidas; o vídeo continua a ser servido
em `/radioamadorismo/ser-radioamador/`.

---

### DT-011 — Breakpoints das tabelas espalhados

**Severidade:** Baixa · **Ficheiros:** `src/styles/global.css`, `TabelaRepetidores.astro`, `rede/balizas.astro`, `arla/quem-somos.astro`

**Problema.** `.so-largo`/`.so-estreito` definidos em três ficheiros, com três pontos de
rutura (700, 860 e 900 px) e o mesmo bloco de regras repetido.

**Solução.** O **comportamento** foi centralizado em `global.css`, na camada `utilities`; os
**três valores mantiveram-se**, porque cada tabela deixa de caber a uma largura própria —
forçar um só ponto de rutura espremeria a tabela de repetidores a 700 px, ou passaria a de
associados a cartões muito antes de ser preciso. O que estava duplicado era o padrão, não o
valor.

```html
<div class="tabela-envolvente so-largo so-largo--860"> … </div>
<ul   class="cartoes-repetidores so-estreito so-estreito--860"> … </ul>
```

A regra de impressão — mostrar sempre a tabela — ficou no bloco `@media print` com
`!important`, porque os `<style>` de componente do Astro não estão em camada nenhuma e
ganhariam a uma regra em `@layer`. As três páginas deixaram de ter regras de `display` para
estas classes.

**Validação.** `npm run qa` confirma que não há transbordo horizontal entre 320 e 1440 px, e
que as tabelas continuam a passar a cartões nas larguras certas. A documentação
(`docs/qualidade.md`, `wiki/Design-Responsivo.md`) descreve agora a implementação real.

---

### DT-012 — Rotas do radioamadorismo duplicadas

**Severidade:** Baixa · **Ficheiros:** `src/lib/navegacao.ts`, `src/pages/radioamadorismo/[pagina].astro`

**Problema.** O mapa `ROTAS` e o array de `getStaticPaths()` repetiam as mesmas chaves no
mesmo ficheiro.

**Solução, e porque não foi a óbvia.** A primeira tentativa — `Object.keys(ROTAS)` com
`ROTAS` no frontmatter — **fez o build falhar** com `ROTAS is not defined`: o Astro avalia
`getStaticPaths()` num módulo à parte, que não vê as constantes do frontmatter. Era essa a
razão da duplicação original.

O mapa passou para `src/lib/navegacao.ts`, como `ROTAS_RADIOAMADORISMO`. A página importa-o
no frontmatter e reimporta-o dinamicamente dentro de `getStaticPaths()` — a mesma técnica
que a paginação de notícias já usava. Acrescentar uma entrada passou a chegar para a rota
existir.

**Validação.** O build gera `/radioamadorismo/o-que-e/` e
`/radioamadorismo/ser-radioamador/`, como antes; 296 ficheiros HTML, o mesmo número da
baseline. `npm run lint:links` sem ligações partidas.

---

### DT-014 — Tamanho dos documentos escrito à mão

**Severidade:** Baixa · **Ficheiros:** `scripts/validar-documentos.mjs` (novo)

**Problema.** O campo `tamanho` de cada documento era escrito à mão no CMS e nunca
confrontado com o ficheiro.

**Solução.** Guião que compara o `tamanho` publicado com o tamanho real, confirma que cada
PDF existe em `public/`, e que o `tipo` corresponde à extensão. Tem `--corrigir`, que
reescreve os valores em vez de falhar.

**Validação.** Os três tamanhos publicados (109 KB, 141 KB, 156 KB) **já estavam certos** —
nenhum dado foi alterado. O guião passa a apanhar a divergência da próxima vez que um PDF
for substituído.

---

### BUG-001 — Condição sem efeito

**Severidade:** Baixa · **Ficheiro:** `src/lib/rede.ts`

**Problema.** `tipo: d.filtros.includes('aprs') ? 'repetidor' : 'repetidor'` — os dois ramos
devolviam o mesmo valor.

**Solução: a mais simples.** Ficou `tipo: 'repetidor'`. Dar aos digipeaters APRS um tipo e
uma cor próprios exigiria acrescentar uma entrada à legenda do mapa e uma cor ao sistema de
design, ou seja, uma alteração visual — que está fora do âmbito. O comportamento atual, com
os APRS a aparecerem com a cor dos repetidores, é o que a auditoria considera aceitável.

**Validação.** O mapa continua a mostrar os marcadores como antes; o teste funcional do
Leaflet passa.

---

### BUG-002 — Contagem de repetidores por texto

**Severidade:** Baixa · **Ficheiro:** `src/components/TabelaRepetidores.astro`

**Problema.** Cada repetidor aparece duas vezes no DOM (tabela e cartão), e a contagem
eliminava duplicados com um `Set` sobre `data-texto`. Dois repetidores com exatamente o
mesmo texto pesquisável contariam como um.

**Solução.** Acrescentou-se `data-id={d.id}` às duas vistas, e a chave do `Set` passou a ser
o `id`, que o esquema garante existir em todos os repetidores.

**Validação.** `npm run qa`, testes funcionais: filtro por banda UHF (9 → 5), pesquisa por
texto («arrabida» → 4 resultados), estado vazio com a mensagem correta, e a contagem certa
em todos os casos.

---

### Content-Security-Policy

**Origem:** lacuna de segurança apontada na auditoria · **Ficheiros:** `scripts/lib/csp.mjs`, `scripts/auditar-csp.mjs`, `public/.htaccess`, `docs/seguranca-csp.md`

**Solução: `Report-Only`, testada em modo impositivo.** A política vive em
`scripts/lib/csp.mjs` (fonte única) e é servida no `.htaccess` como
`Content-Security-Policy-Report-Only` — **não bloqueia nada**.

`npm run audit:csp` interceta cada resposta HTML num navegador real, injeta a mesma política
como cabeçalho **impositivo**, percorre 15 páginas (mapas, meteorologia espacial, pesquisa,
`/admin/`, notícias, artigos, eventos, arquivo, documentos, 404) e conta o que ficaria
bloqueado. Verifica também que a cópia no `.htaccess` não divergiu da fonte.

**O teste valeu a pena logo à primeira:** encontrou uma origem que a leitura do código tinha
deixado passar — `services.swpc.noaa.gov`, a imagem de síntese da NOAA em
`/radioamadorismo/meteorologia-espacial/`. Sem o teste, impor a política teria feito
desaparecer a imagem **sem erro visível**.

**Validação.** 15 páginas, **0 violações** com a política imposta. Leaflet, OpenStreetMap,
HamQSL, NOAA, Pagefind e Decap CMS funcionam todos.

**Limitação dita por inteiro:** a política leva `'unsafe-inline'` em `script-src`, porque o
Astro gera `<script type="module">` em linha e o guião do tema tem de correr antes da
primeira pintura. **Assim, a CSP não protege contra XSS injetado em linha.** Continua a
fechar origens externas, `eval`, `<base>`, formulários para fora e o embebimento do sítio.
O caminho para a impor está em [`seguranca-csp.md`](seguranca-csp.md).

---

### Segurança do script do Decap CMS

**Origem:** lacuna apontada na auditoria · **Ficheiro:** `public/admin/index.html`

**Problema.** O editor era carregado de `https://unpkg.com/decap-cms@^3.8.4/...`, com
intervalo de versões e sem Subresource Integrity: o CDN escolhia a versão, e um ficheiro
trocado passaria sem ninguém dar por isso — com acesso de escrita ao repositório.

**Solução escolhida.** Versão fixa mais SRI, em vez de auto-alojamento. Auto-alojar
implicaria versionar ~5 MB de JavaScript no repositório; a versão fixa com `integrity`
fecha o mesmo risco.

O intervalo `^3.8.4` resolvia, à data, para **3.16.2** — o que ilustra o problema: a versão
servida mudava sozinha. Fixou-se nessa mesma 3.16.2, pelo que **não há alteração de
comportamento**.

**Validação, num Chromium real:**

| Teste | Resultado |
| --- | --- |
| Carregamento com o hash correto | `200`, `window.CMS` definido, painel de diagnóstico removido |
| Carregamento com um hash errado | ficheiro **recusado** pelo navegador, `window.CMS` indefinido, painel de diagnóstico visível |

O segundo teste é o que prova que o `integrity` está a ser aplicado e não silenciosamente
ignorado. Ficou no `index.html` o comando para recalcular o hash ao atualizar, e o painel de
diagnóstico passou a listar as causas possíveis de o editor não arrancar.

---

### Integração contínua

**Origem:** ausência de `.github/` apontada na auditoria · **Ficheiro:** `.github/workflows/qualidade.yml` (novo)

**Solução: verificação, sem publicação.** Dois trabalhos, a cada *push* e *pull request*:

- **`verificar`** — `npm audit` (informativo), as quatro validações, `npm test`,
  `check`, `build`, `lint:links`, `audit:seo`;
- **`navegador`** — instala o Chromium do Playwright, serve o build e corre `qa`,
  `audit:csp` e `audit:desempenho`; guarda `reports/` como artefacto mesmo em caso de falha.

**Não há nenhum passo de implantação e não se usa nenhum segredo**, de propósito: publicar
exigiria credenciais do alojamento e uma decisão sobre quem controla a publicação, que não
foi tomada. Nenhuma credencial foi inventada.

O workflow **não** define `CHROMIUM_PATH`, para exercitar a terceira via de resolução — o
navegador que o Playwright acabou de instalar.

---

## Exigem decisão da direção da associação

Cinco, detalhadas em [`decisoes-pendentes.md`](decisoes-pendentes.md). **Nenhuma foi
tomada.**

### DOC-020 — REQUIRES DECISION — BRANCH DE PRODUÇÃO

`public/admin/config.yml` indica `branch: main`, e **o repositório não tem nenhuma branch
com esse nome** — confirmado com `git ls-remote --heads origin`, que devolve três branches
`claude/…`, sendo a predefinida `claude/arla-website-redesign-vcemm3`.

**O valor não foi alterado.** Nenhuma branch foi criada, renomeada ou apagada.

O que se fez, em vez disso:

1. bloco de comentário no `config.yml` a explicar o que está errado, o que acontece em
   consequência, e as **duas vias possíveis**, cada uma a exigir a alteração de **uma só
   linha**;
2. `npm run validar:esquemas` avisa, em todas as execuções, enquanto a branch indicada não
   existir;
3. a página `/admin/` passou a listar a branch inexistente entre as causas de o editor não
   arrancar;
4. `docs/implantacao.md`, `wiki/CMS-Decap.md` e `docs/gestao-de-conteudos.md` dizem-no com
   todas as letras.

**Não se afirma em lado nenhum que o fluxo de publicação do CMS está operacional.**

### OAuth do CMS em produção — PARCIALMENTE IMPLEMENTADO

No repositório está tudo feito e verificado: `repo` correto, coleções coerentes com os
esquemas (verificado automaticamente), caminhos de media certos, editor com versão fixa e
SRI, backend local funcional, e nenhuma afirmação de publicação automática.

Fora do repositório falta tudo: aplicação OAuth do GitHub, serviço de autenticação, domínio
de produção, *callback*, e a confirmação de quem tem acesso Write. **Nenhuma credencial foi
inventada e nenhum segredo foi commitado.** Instruções em `docs/implantacao.md`, incluindo
as permissões que a aplicação OAuth pede e porque não basta o alojamento atual.

Mantém-se **PARCIALMENTE IMPLEMENTADO** até a infraestrutura existir e o fluxo ser testado
com uma gravação real.

### Publicação manual ou automática · Licença · Dados institucionais

As três restantes, com opções e consequências, em
[`decisoes-pendentes.md`](decisoes-pendentes.md). Sobre a licença (DT-013): **nenhum ficheiro
`LICENSE` foi criado**; a ausência e a sua consequência prática — código integralmente
protegido por direitos de autor, sem reutilização legal possível — estão documentadas no
README e no documento de decisões.

---

## Adiadas

### Migração do Astro 5 → 7 (DT-004, parte)

As duas vulnerabilidades restantes (`astro` crítica, `esbuild` baixa) só se resolvem com
`astro@7.3.3` — **duas versões maiores** acima da 5.18 atual. O aviso do `astro` cobre
literalmente todas as versões até à 7.2.7: não existe correção dentro do major 5.

**Porquê adiar.** É uma migração com alterações de API, de configuração e de comportamento
a validar página a página, não uma correção de rotina. A análise de aplicabilidade da
auditoria mantém-se: os avisos dizem respeito a `define:vars`, server islands, View
Transitions, atributos em spread, nomes de slot, SSRF em página de erro e RCE por otimização
AVIF — **nada disso é usado aqui**, e o build é estático a partir de conteúdo do próprio
repositório. Trocar uma vulnerabilidade em grande medida não aplicável por um build partido
seria um mau negócio.

A fazer como trabalho isolado, com `npm run validar`, `build`, `lint:links`, `qa`,
`audit:seo`, `audit:desempenho` e `audit:csp` a seguir.

### Otimização de imagens no build

**Estado inspecionado:** nenhuma página usa `<Image>` ou `getImage()`. As imagens vivem em
`public/imagens/conteudo/` e são referenciadas por caminho absoluto a partir do Markdown e
dos JSON. O `media_folder` do CMS aponta para lá.

**Porquê adiar.** Passar a `<Image>` obrigaria a mover a media para `src/assets/`, o que
partiria os endereços públicos, o `media_folder` do CMS e as referências dentro do conteúdo.
Não é uma otimização incremental: é uma mudança do sistema de conteúdos, com risco
desproporcionado face ao ganho — o sítio já está com **LCP entre 472 e 656 ms**, abaixo de
um terço do limiar.

O que se fez sem risco: `scripts/otimizar-media.mjs` ganhou entrada em `package.json`
(`npm run media:otimizar`), para ser encontrável. Fica registado que **uma imagem carregada
pelo CMS é servida tal como foi enviada**.

---

## Testes — antes

Baseline no commit `e67e616`, antes de qualquer alteração:

| Verificação | Resultado |
| --- | --- |
| `npm run check` | PASSA — 70 ficheiros, 0 erros, 0 avisos, **8 sugestões** |
| `npm run build` | PASSA — 296 ficheiros HTML, Pagefind com 108 páginas |
| `npm run lint:links` | PASSA — 5314 internas, 146 âncoras, 0 partidas |
| `npm run audit:seo` | PASSA — 0 problemas, 9 avisos de título longo |
| `npm run qa` | PASSA — 74 análises axe-core, 0 violações, 17/17 funcionais |
| `npm run audit:desempenho` | PASSA — todas as páginas dentro dos limiares |
| `npm audit` | **3 vulnerabilidades** (1 crítica, 1 alta, 1 baixa) |
| Testes unitários | **Não existiam** |

## Testes — depois

| Verificação | Resultado | Diferença |
| --- | --- | --- |
| `npm run check` | PASSA — 76 ficheiros, 0 erros, 0 avisos, **1 sugestão** | −7 sugestões |
| `npm test` | PASSA — **3 ficheiros, 58 testes** | novo |
| `npm run validar:dados` | PASSA — 5 ficheiros validados | novo |
| `npm run validar:esquemas` | PASSA — 9 coleções, 10 avisos | novo |
| `npm run redirecoes:validar` | PASSA — 191 regras coerentes, sem ciclos nem cadeias | novo |
| `npm run validar:documentos` | PASSA — 3 de 3, tamanhos certos | novo |
| `npm run build` | PASSA — **296 ficheiros HTML**, Pagefind com 108 páginas | igual |
| `npm run lint:links` | PASSA — 5314 internas, 146 âncoras, **0 partidas** | igual |
| `npm run audit:seo` | PASSA — **0 problemas**, 9 avisos de título longo | igual |
| `npm run qa` | PASSA — **74 análises axe-core, 0 violações, 17/17 funcionais** | igual |
| `npm run audit:desempenho` | PASSA — LCP 512–628 ms, CLS 0 em todas | igual |
| `npm run audit:csp` | PASSA — **15 páginas, 0 violações** | novo |
| `npm audit` | **2 vulnerabilidades** (1 crítica, 1 baixa) | −1 |

**Nenhuma regressão.** As contagens que importam — 296 páginas, 5314 ligações, 0 violações
de acessibilidade, 17/17 testes funcionais — são idênticas à baseline.

Os erros de consola `net::ERR_TOO_MANY_RETRIES` continuam a aparecer nas páginas com mapa e
na de meteorologia espacial: 7 na medição original, 5 a 20/09, **6 a 21/09**. O número varia
com o ambiente, o que confirma a causa externa — o proxy do ambiente de teste bloqueia as
telas do OpenStreetMap e as imagens do HamQSL. Nenhum erro de JavaScript próprio do sítio
foi registado.

---

## Estado de segurança

| | Antes | Depois |
| --- | --- | --- |
| `npm audit` | 3 (1 crítica, 1 alta, 1 baixa) | **2** (1 crítica, 1 baixa) |
| `sharp` (alta) | Vulnerável | **Corrigida** — `^0.35.4` com `overrides` |
| Content-Security-Policy | Inexistente | **`Report-Only`**, testada em modo impositivo: 15 páginas, 0 violações |
| Script do Decap | `^3.8.4`, sem SRI | **Versão fixa + `integrity` + `crossorigin`**, aplicação verificada em teste |
| Validação dos dados publicados | Nenhuma nos 5 JSON diretos | **Esquemas Zod `strict`**, dentro do build |
| `npm audit` em verificação periódica | Não existia | **Corre em CI a cada *push*** |
| Cabeçalhos de segurança | 5, só Apache | 6, só Apache — a limitação mantém-se e está documentada |

Sem alteração: não há segredos no repositório, não há código a correr no servidor, a
autenticação continua delegada ao GitHub, e todo o conteúdo é Markdown de quem tem acesso
de escrita.

---

## Dívida técnica remanescente

| ID | Descrição | Estado |
| --- | --- | --- |
| DT-004 (parte) | `astro` crítica e `esbuild` baixa | **Adiada** — exige migração Astro 5 → 7 |
| DT-013 | Sem ficheiro `LICENSE` | **Exige decisão** da direção |
| — | Otimização de imagens no build | **Adiada** — exigiria mudar o sistema de media |
| — | CSP com `'unsafe-inline'` em `script-src` | Documentada em `seguranca-csp.md`; impô-la exige hashes gerados no build |
| — | Sem linter (ESLint/Prettier) | Não apontado pela auditoria; `astro check` é o equivalente mais próximo |
| — | CMS de eventos sem 6 campos que o esquema aceita | Aviso de `validar:esquemas`; acrescentá-los muda o que quem edita vê |
| — | `filtros` dos repetidores: CMS restringe, Zod aceita qualquer texto | Documentado em `wiki/CMS-Decap.md`; o CMS é o mais restritivo, o que é seguro |
| — | `.htaccess` não é executado por nenhum Apache nos testes | Verificado por concordância entre ficheiros |

---

## Ficheiros alterados

### Novos

```text
.github/workflows/qualidade.yml      integração contínua (verifica, não publica)
docs/decisoes-pendentes.md           as 5 decisões da direção
docs/remediacao-da-auditoria.md      este ficheiro
docs/seguranca-csp.md                estado da CSP e caminho para a impor
scripts/auditar-csp.mjs              testa a CSP em modo impositivo
scripts/gerar-redirecoes.mjs         gera os ficheiros de servidor
scripts/validar-redirecoes.mjs       coerência das redireções
scripts/validar-dados.mjs            esquemas Zod dos 5 JSON diretos
scripts/validar-esquemas.mjs         CMS ↔ content.config.ts
scripts/validar-documentos.mjs       PDF existentes e tamanhos certos
scripts/lib/redirecoes.mjs           regras derivadas da fonte única
scripts/lib/capturas.mjs             capturas de ecrã — implementação única
scripts/lib/csp.mjs                  a política, fonte única
src/pages/robots.txt.ts              robots.txt gerado no build
vitest.config.ts                     configuração dos testes
tests/maidenhead.test.ts             19 testes
tests/sitio.test.ts                  21 testes
tests/conteudo.test.ts               18 testes
tests/duplos/astro-content.ts        duplo de astro:content
```

### Removidos

```text
public/robots.txt                        substituído por src/pages/robots.txt.ts
public/imagens/conteudo/hamRadio.mp4     duplicado byte a byte; 301 acrescentada
```

### Código e configuração

```text
package.json                         13 guiões novos; sharp ^0.35.4 + overrides;
                                     vitest, yaml, zod, wait-on
package-lock.json                    atualizado
public/.htaccess                     redireções geradas; CSP Report-Only;
                                     secções mantidas à mão intactas
public/_redirects                    gerado
public/admin/config.yml              bloco sobre a branch por decidir (DOC-020)
public/admin/index.html              versão fixa + SRI; diagnóstico mais útil
src/lib/redirects.mjs                fonte única: 3 exportações
src/lib/rede.ts                      BUG-001
src/lib/conteudo.ts                  POR_PAGINA exportada
src/lib/navegacao.ts                 ROTAS_RADIOAMADORISMO
src/styles/global.css                vista dupla tabela/cartões centralizada
src/components/TabelaRepetidores.astro   BUG-002, data-id, breakpoints
src/components/BotaoCopiar.astro         execCommand documentado como intencional
src/components/CartaoArtigo.astro        importação por usar
src/layouts/Artigo.astro                 tipoArtigo removida
src/pages/robots.txt.ts                  (novo)
src/pages/noticias/index.astro           POR_PAGINA
src/pages/noticias/pagina/[pagina].astro POR_PAGINA
src/pages/noticias/[...slug].astro       tipoArtigo
src/pages/tecnica/[...slug].astro        tipoArtigo
src/pages/eventos/[...slug].astro        tipoArtigo, importação por usar
src/pages/eventos/index.astro            importação por usar
src/pages/radioamadorismo/[pagina].astro rotas derivadas de uma fonte
src/pages/arla/index.astro               variável por usar
src/pages/arla/quem-somos.astro          breakpoints
src/pages/rede/balizas.astro             breakpoints
src/pages/rede/cs5arla.astro             importação por usar
src/pages/contactos.astro                variável por usar
scripts/qa.mjs                           delega as capturas
scripts/capturas.mjs                     delega as capturas
```

### Documentação

```text
README.md                        comandos, CHROMIUM_PATH, testes, CI/CD,
                                 redireções, segurança, licença, media
docs/arquitetura.md              redireções e robots.txt
docs/gestao-de-conteudos.md      percurso real de uma alteração; estado do CMS
docs/implantacao.md              OAuth passo a passo; branch por decidir; CSP
docs/mapa-de-redirecoes.md       arquitetura gerada; verificação; recolha final
docs/qualidade.md                testes unitários, validações, breakpoints
wiki/CI-CD.md                    reescrito: CI existe, publicação não
wiki/CMS-Decap.md                branch, SRI, verificação de esquemas
wiki/Design-Responsivo.md        padrão centralizado
wiki/Estrutura-do-Projeto.md     ficheiros gerados
wiki/Implantacao.md              contagem de regras
wiki/Media-e-Imagens.md          DT-010
wiki/Redirecionamentos.md        fonte única, geração, validação
wiki/Resolucao-de-Problemas.md   diagnóstico de redireções
wiki/SEO.md                      robots.txt gerado
wiki/Seguranca.md                CSP, SRI, vulnerabilidades
wiki/Testes-e-Qualidade.md       12 ferramentas, testes unitários
wiki/Variaveis-de-Ambiente.md    CHROMIUM_PATH
```

**Não foi alterado nenhum ficheiro de conteúdo** — nem em `src/content/`, nem os dados da
associação em `src/data/`. Nenhuma frequência, nenhum indicativo, nenhum nome, nenhum valor
de quota, nenhum IBAN, nenhum documento legal e nenhum facto histórico.

---

## Alterações incompatíveis

**Nenhuma alteração incompatível.**

O sítio publicado é idêntico ao anterior: o mesmo número de páginas (296), os mesmos
endereços, o mesmo aspeto, o mesmo conteúdo. Não há alteração de CSS visível, de componentes
ou de esquemas de conteúdo.

Quatro mudanças afetam **quem desenvolve**, não quem visita, e estão documentadas:

1. **`public/.htaccess` e `public/_redirects` são gerados.** Editá-los à mão deixou de
   funcionar: as alterações dentro dos marcadores perdem-se na geração seguinte. A fonte é
   `src/lib/redirects.mjs`.
2. **`public/robots.txt` deixou de existir** como ficheiro estático. É gerado no build; o
   `dist/robots.txt` continua a existir com o mesmo conteúdo.
3. **A prop `tipoArtigo` foi removida** de `Artigo.astro` e dos três chamadores. Nunca foi
   lida.
4. **`.so-largo`/`.so-estreito` precisam agora da classe de ponto de rutura** ao lado
   (`so-largo--860`, etc.). As três utilizações existentes foram atualizadas.

Uma mudança de comportamento **em produção**, e é uma correção: no Apache,
`/site/qualquer-coisa/` passa a redirecionar para a página inicial, como já acontecia no
Netlify e como o comentário do próprio `.htaccess` dizia. Antes dava 404.
