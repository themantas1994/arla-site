# Resultados de qualidade

Medições feitas sobre o build de produção, com as ferramentas do repositório. Todas são
reproduzíveis:

> **Última reverificação: 21/09/2026**, depois da remediação da auditoria (ver
> [`remediacao-da-auditoria.md`](remediacao-da-auditoria.md)). Tudo voltou a passar, com os
> mesmos resultados de fundo: 74 análises axe-core sem violações, 17/17 testes funcionais,
> 0 ligações internas partidas, 0 problemas de SEO e todas as páginas dentro dos limiares
> de Core Web Vitals. Juntaram-se 58 testes unitários, a validação dos dados, a
> concordância das redireções e o teste da Content-Security-Policy. As diferenças
> observadas são de ambiente (ver «Erros de consola») e de arredondamento nos tempos.

Verificações que não precisam de navegador:

```bash
npm run validar            # tipos + redireções + esquemas + dados + documentos + testes
```

Verificações sobre o build, com o sítio a correr:

```bash
npm run build
npm run preview &
npm run qa                 # acessibilidade, responsivo, alvos de toque, funcional
npm run audit:seo          # metadados, dados estruturados, hierarquia, sitemap
npm run audit:desempenho   # Core Web Vitals sob 4G lento
npm run audit:csp          # Content-Security-Policy em modo impositivo
npm run lint:links -- --externas
```

Todas correm também em integração contínua, a cada *push* e *pull request*
(`.github/workflows/qualidade.yml`). **O workflow verifica; não publica nada.**

Os relatórios em bruto ficam em `reports/`.

---

## Testes unitários

**58 testes, 3 ficheiros, todos a passar.** Motor: Vitest (`npm test`).

Cobrem a lógica pura de `src/lib/`, que antes só era verificada por inspeção visual:

| Função | Ficheiro | O que os testes fixam |
| --- | --- | --- |
| `quadriculaParaCoordenadas()` | `tests/maidenhead.test.ts` | conversão da quadrícula da sede, centro e não canto, precisão por comprimento, extremos do sistema, 10 formas inválidas rejeitadas |
| `formatarCoordenadas()` | `tests/maidenhead.test.ts` | graus e minutos decimais, hemisférios, zero |
| `estadoEvento()` | `tests/sitio.test.ts` | futuro/a decorrer/terminado, fronteiras do primeiro e do último dia, indiferença à hora, evento sem fim, fim anterior ao início |
| `intervaloDatas()` | `tests/sitio.test.ts` | mesmo dia, mesmo mês, mesmo ano, anos diferentes, meses em PT-PT |
| `tempoLeitura()` | `tests/sitio.test.ts` | mínimo de 1 minuto, 200 palavras/minuto, arredondamento, texto vazio, texto muito longo |
| `normalizar()` | `tests/sitio.test.ts` | acentos e maiúsculas |
| `slugCategoria()` | `tests/conteudo.test.ts` | acentos, pontuação, hífenes nas pontas, idempotência |
| `relacionados()` | `tests/conteudo.test.ts` | lista vazia, um só candidato, nunca o próprio artigo, etiquetas acima de categoria, preenchimento pelos mais recentes, sem repetidos |
| `textoSimples()` | `tests/conteudo.test.ts` | blocos de código, imagens, ligações, texto vazio |

Os testes não carregam o Astro: `tests/duplos/astro-content.ts` substitui o módulo virtual
`astro:content`, e qualquer chamada a `getCollection()` falha com uma mensagem explícita.
Só lógica pura é testada aqui — o resto é coberto pelos testes funcionais do `npm run qa`.

---

## Validação de dados e configuração

Quatro verificações acrescentadas na remediação da auditoria, todas sem navegador:

| Comando | O que garante |
| --- | --- |
| `npm run validar:dados` | os 5 ficheiros JSON fora das coleções têm todos os campos, com os tipos certos (esquemas Zod `strict`: um campo mal escrito falha em vez de dar `undefined`). Corre dentro do `npm run build` |
| `npm run validar:esquemas` | o CMS não deixa gravar nada que o build venha a recusar — campos, obrigatoriedade e valores de `select` comparados com `src/content.config.ts` |
| `npm run redirecoes:validar` | as 191 regras coincidem nos três ficheiros, sem duplicados, ciclos nem cadeias |
| `npm run validar:documentos` | cada PDF da biblioteca existe e o tamanho publicado corresponde ao ficheiro |

---

## Acessibilidade — WCAG 2.2 AA

Motor: **axe-core** via Playwright, com as regras `wcag2a`, `wcag2aa`, `wcag21a`,
`wcag21aa`, `wcag22aa` e `best-practice`.

| Métrica | Resultado |
| --- | --- |
| Análises | **74** (37 páginas × tema claro e escuro) |
| Violações | **0** |
| Violações graves ou críticas | **0** |

Verificações manuais adicionais, automatizadas em `scripts/qa.mjs`:

| Verificação | Resultado |
| --- | --- |
| Alvos de toque ≥ 24 px a 375 px de largura | ✓ Nenhum alvo pequeno de mais |
| Submenus operáveis por teclado (Enter abre, Escape fecha) | ✓ |
| Nada depende de passar o rato | ✓ |
| Um só `<h1>` por página, hierarquia sem saltos | ✓ |
| Idioma declarado `pt-PT` em todas as páginas | ✓ |
| Estados comunicados por símbolo e texto, nunca só por cor | ✓ |

### O que foi corrigido durante os testes

1. **Contraste insuficiente no tema claro.** O verde «operacional» (`#0f8f6d`) dava 3,51:1
   sobre o fundo claro dos distintivos, abaixo do mínimo de 4,5:1. Escurecido para
   `#0a6e53` (5,4:1).
2. **Opacidade a quebrar o contraste.** Os cartões de eventos terminados tinham
   `opacity: 0.86`, o que baixava o texto para 3,46:1. A distinção passou a ser feita pelo
   fundo e pelo tom do calendário, sem tocar na opacidade.
3. **Hierarquia de títulos.** Na listagem de notícias, os cartões usavam `<h3>` logo a
   seguir ao `<h1>`. O nível do título dos cartões passou a ser configurável.
4. **Alvos de toque no rodapé.** As ligações legais tinham 15 px de altura; passaram a
   ter uma área de 44 px.

Ligações dentro de frases mantêm o tamanho do texto: a WCAG 2.5.8 isenta-as
explicitamente, e aumentá-las estragaria a entrelinha.

### Limites desta medição

O axe-core deteta a maioria dos problemas estruturais, mas **não substitui teste com
pessoas**. Não foram testados: leitores de ecrã reais (NVDA, VoiceOver), navegação
exclusivamente por teclado por um utilizador habitual, nem compreensão do texto por
pessoas com dificuldades de leitura.

---

## Desempenho — Core Web Vitals

Medido com Playwright a 390 px de largura, rede **4G lento** (1,6 Mbit/s, 150 ms de
latência), **CPU 4× mais lento** e cache fria. LCP e CLS através de `PerformanceObserver`,
como as ferramentas de campo.

| Página | Peso | Pedidos | LCP | FCP | CLS |
| --- | --- | --- | --- | --- | --- |
| Início | 252 kB | 8 | **704 ms** | 704 ms | **0** |
| Repetidores | 167 kB | 6 | **596 ms** | 596 ms | **0** |
| Notícias | 272 kB | 6 | **496 ms** | 496 ms | **0** |
| Artigo técnico longo | 152 kB | 4 | **616 ms** | 616 ms | **0** |
| Eventos | 106 kB | 4 | **520 ms** | 520 ms | **0** |
| Contactos (com mapa) | 107 kB | 6 | **544 ms** | 544 ms | **0** |
| Ser associado/a | 87 kB | 4 | **508 ms** | 508 ms | **0** |
| Quero começar | 92 kB | 4 | **512 ms** | 512 ms | **0** |

Limiares de referência: LCP ≤ 2500 ms, CLS ≤ 0,1. **Todas as páginas ficam abaixo de um
terço do limiar de LCP, e o CLS é zero em todas.**

### Comparação com o sítio anterior

Página inicial, mesma medida (HTML + CSS + JS + imagens):

| | WordPress anterior | Novo sítio | Diferença |
| --- | --- | --- | --- |
| Peso total | **1364 kB** | **252 kB** | −82 % |
| Pedidos | **47** | **8** | −83 % |
| JavaScript | **440 kB** | **5 kB** | −99 % |
| Pedidos a terceiros | vários | **0** | — |

O CSS do sítio antigo estava embutido nos 107 kB de HTML da página inicial, o que também
explica um documento inicial pesado.

### Repartição do peso da página inicial

| Recurso | Peso |
| --- | --- |
| Documento HTML | 141 kB |
| CSS | 48 kB |
| JavaScript | 5 kB |
| Imagens | 58 kB |
| Tipos de letra | 0 kB (pilha do sistema) |

Os mapas e o índice de pesquisa não entram nestes números porque só são descarregados
quando alguém os usa.

### Otimização dos recursos migrados

| | Antes | Depois |
| --- | --- | --- |
| 99 imagens do WordPress | 68 MB | 18 MB |
| Vídeo da torre | 40 MB | 4 MB |

---

## Responsivo

Testado a **320, 375, 390, 768, 1024, 1280 e 1440 px** em 37 páginas (259 combinações).

| Verificação | Resultado |
| --- | --- |
| Transbordo horizontal | ✓ Nenhum, em nenhuma largura |
| Tabelas em ecrãs estreitos | ✓ Passam a cartões, cada uma no seu ponto de rutura |
| Menu por toque | ✓ Abre, expande secções e fecha |

As três tabelas de dados não mudam de vista todas à mesma largura, porque não têm o mesmo
número de colunas. Os três pontos de rutura estão agora **definidos num só sítio**,
em `src/styles/global.css` (auditoria: DT-011), e cada tabela escolhe o seu pela classe:

| Tabela | Ficheiro | Classes | Ponto de rutura |
| --- | --- | --- | --- |
| Associados (5 colunas) | `arla/quem-somos.astro` | `so-largo--700` / `so-estreito--700` | 700 px |
| Repetidores (10 colunas) | `TabelaRepetidores.astro` | `so-largo--860` / `so-estreito--860` | 860 px |
| Balizas (9 colunas) | `rede/balizas.astro` | `so-largo--900` / `so-estreito--900` | 900 px |

O comportamento partilhado — esconder a tabela por baixo do ponto de rutura, esconder os
cartões por cima dele, e mostrar sempre a tabela na impressão — está escrito uma só vez.
As páginas já não repetem regras de `display`.

O menu passa de barra a botão a **1180 px** (`Cabecalho.astro`).

Corrigido durante os testes: a tabela da página de cookies empurrava a página 173 px para
fora a 320 px. Passou a deslocar-se dentro do seu próprio contentor.

---

## SEO

| Verificação | Resultado |
| --- | --- |
| Páginas analisadas | 112 (4 com `noindex`, por serem utilitárias) |
| Problemas | **0** |
| Endereços no sitemap | 109 |
| `robots.txt` | presente, bloqueia `/admin/` e `/area-reservada/` |
| Título, descrição, canónico, Open Graph, Twitter Card | ✓ em todas as páginas |
| Idioma `pt-PT` | ✓ em todas as páginas |

### Dados estruturados (JSON-LD)

| Tipo | Ocorrências |
| --- | --- |
| `Organization` | 112 |
| `BreadcrumbList` | 109 |
| `NewsArticle` | 39 |
| `Event` | 17 |
| `TechArticle` | 8 |
| `FAQPage` | 2 |
| `HowTo` | 1 |
| `ContactPage` | 1 |
| `WebSite` | 1 (com `SearchAction`) |

### Avisos não bloqueantes

**9 páginas com título acima de 65 caracteres.** São eventos cujo nome oficial é mesmo
comprido («12.ª Edição do Fim de Semana Nacional de Amplitude Modulada em Onda Curta e
VHF»). O Google trunca a apresentação, mas encurtar o nome real do evento perderia
informação e afastaria-se do que a ARLA publica. Mantidos como estão.

---

## Ligações

Verificação sobre os 296 ficheiros HTML gerados.

| Tipo | Quantidade | Partidas |
| --- | --- | --- |
| Internas | 5314 | **0** |
| Âncoras (`#secção`) | 146 | **0** |
| Externas distintas | 58 | 14 (ver abaixo) |

### Ligações externas que não respondem

**Todas menos duas estão dentro de artigos migrados e já estavam mortas no sítio
anterior.** Não foram alteradas: corrigir ligações dentro de um texto histórico seria
reescrever o registo do que a ARLA publicou na altura. Os artigos em causa estão
identificados como conteúdo de arquivo.

| Ligação | Estado | Onde |
| --- | --- | --- |
| `ndblist.info/datamodes/interfacingv2.pdf` | 404 | Noite digital PSK + ROS (2018) |
| `mds975.co.uk/…/amateur_radio_data_modes.html` | 503 | Noite digital PSK + ROS (2018) |
| `g4dcv.co.uk/radio/interface.html` | 404 | Noite digital PSK + ROS (2018) |
| `mfjenterprises.com/Categories.php…` | 400 | Noite digital PSK + ROS (2018) |
| `microham.com/contents/en-us/d28.html` | 404 | Noite digital PSK + ROS (2018) |
| `giga.co.za/ocart/…product_id=154` | 404 | Noite digital PSK + ROS (2018) |
| `iaru.org/world-amateur-radio-day.html` | não resolve | Dia Mundial do Radioamador (2019) |
| `goo.gl/forms/nEnqGinvxSTR69Kq1` | 404 | Comunicado RGPD (2018) — encurtador descontinuado |
| `iaru-r1.org/index.php/174-news/…` | 404 | Reunião do grupo preparatório CEPT (2019) |
| `anacom.pt/render.jsp?contentId=1713480` | 403 | ANACOM, anteprojeto (2022) |
| `anacom.pt/render.jsp?contentId=1498414` | 503 | Faixa 1850-2000 kHz (2019) |
| `www2.plala.or.jp/…/kgstv.zip` | 503 | KG-STV no QO-100 |
| `users.skynet.be/on0eme/…` | 503 | Weak Signals, parte 2 |
| `www.anacom.pt/` | 403 | **Quero começar** (ligação nova) |

**Sobre as duas ligações que não vêm de artigos migrados:**

- **`anacom.pt`** devolve 403 a pedidos automatizados, mesmo com um agente de navegador
  normal. É o portal oficial do regulador e funciona num navegador real — a ligação está
  correta.
- **`facebook.com/ARLAOficial/`** devolve 400 a pedidos a partir de centros de dados. É a
  página oficial da ARLA, herdada do sítio anterior, e abre normalmente num navegador.

Ambas são inconclusivas por bloqueio a verificação automática, não ligações partidas.

Todas as restantes ligações que a ARLA usa como referência foram verificadas e respondem:
AMSAT-DL, BATC, HamQSL, NOAA/SWPC, IARU, DishPointer e a lista do radio-amador.net.

**Sugestão para a direção:** as ligações mortas dentro de artigos de arquivo podem ser
acompanhadas de uma nota, ou substituídas por uma cópia no Internet Archive. É uma decisão
editorial, não técnica.

---

## Testes funcionais

17 testes num navegador real (Chromium), sobre o build de produção.

| Teste | Resultado |
| --- | --- |
| Filtro de repetidores por banda (UHF) | ✓ 9 → 5 linhas |
| Pesquisa de repetidores, sem acentos | ✓ «arrabida» encontra «Arrábida» (4 resultados) |
| Estado vazio dos filtros de repetidores | ✓ mensagem apresentada |
| Botão de copiar frequência | ✓ valor correto na área de transferência |
| Pesquisa do sítio (Pagefind) | ✓ 25 resultados para «repetidor» |
| Pesquisa do sítio sem acentos | ✓ «satelite» encontra «satélite» |
| Pesquisa sem resultados | ✓ estado vazio apresentado |
| Menu para ecrãs pequenos | ✓ abre, expande secção, fecha |
| Submenu por teclado | ✓ Enter abre, Escape fecha, `aria-expanded` correto |
| Alternância de tema persiste | ✓ mantido após recarregar |
| Mapa (Leaflet + OpenStreetMap) | ✓ telas e marcador carregados |
| Filtro do arquivo | ✓ 64 → 4 itens |
| Filtro de associados sem acentos | ✓ «monica» encontra «Mónica» |
| Descarregamento de PDF | ✓ 109 KB, `application/pdf` |
| Índice de artigo longo | ✓ 7 entradas |
| Redireção do sítio antigo | ✓ `/site/repetidores/` → `/rede/repetidores/` |
| Página 404 | ✓ mensagem, pesquisa e atalhos |

### Um defeito encontrado e corrigido nestes testes

**A pesquisa devolvia resultados para palavras inventadas.** O Pagefind faz correspondência
por prefixo e tolera erros de escrita — útil para «repet» encontrar «repetidores», mas
fazia com que «wxkjqzvbn» devolvesse 10 resultados, por corresponder a «W.» numa tabela.
Foi acrescentado um filtro que só aceita um resultado quando alguma palavra realçada
corresponde mesmo a um termo pesquisado. Agora «wxkjqzvbn» mostra o estado vazio, e as
pesquisas por prefixo e sem acentos continuam a funcionar.

---

## Revisão visual

Revisão página a página em três larguras e nos dois temas; capturas em `reports/capturas/`
(`npm run qa:capturas`).

### Defeitos corrigidos

| Defeito | Correção |
| --- | --- |
| O traço do espectro atravessava os botões e os números do herói, sobretudo em telemóvel | Traço confinado à faixa inferior, com desvanecimento em máscara |
| O botão «Área reservada» saía para fora do cabeçalho (182 px de excesso a partir de 1400 px) | Cabeçalho com largura própria de 1440 px, navegação mais compacta, ponto de rutura a 1180 px |
| O subtítulo do logótipo partia em quatro linhas | Uma só linha; desaparece quando não cabe |
| As setas dos menus apontavam para a direita em vez de para baixo | Os estilos com âmbito do Astro não alcançam o componente filho — passaram a `:global()` |
| No rodapé, o ícone do botão «Ver no mapa» ficava numa linha acima do texto | `.rodape__coluna a` impunha `display:inline-block` aos botões; excluído com `:not(.btn)` |
| Artigos sem índice deixavam metade do ecrã vazia | Coluna centrada quando não há índice lateral |
| 21 resumos começavam por «Prezados Associados,» ou «por Fulano, CT1ABC» | Regenerados a partir do próprio texto, saltando saudações e autoria |

---

## Erros de consola

Ocorrências de `net::ERR_TOO_MANY_RETRIES` nas páginas com mapa e na de meteorologia
espacial — sete na medição original, cinco a 20/09/2026, seis a 21/09/2026. O número varia
com o ambiente, o que é em si um indício. **São do ambiente de teste, não do sítio:** o sandbox onde os testes correram
encaminha o tráfego externo por um proxy que bloqueia parte dos pedidos às telas do
OpenStreetMap e às imagens do HamQSL.

O teste funcional do mapa confirma-o: numa sessão do mesmo navegador, o Leaflet inicializa,
as telas carregam e o marcador aparece. As três páginas afetadas continuam utilizáveis sem
esses recursos — o mapa tem sempre a lista de localizações em texto, e os painéis de
meteorologia espacial têm texto alternativo e ligação à fonte.

**Nenhum erro de JavaScript próprio do sítio foi registado em nenhuma página.**

---

## O que não foi testado

Por honestidade, o que fica por fazer:

- **Leitores de ecrã reais.** O axe-core verifica a estrutura, não a experiência.
- **Navegadores além do Chromium.** O código não usa nada que exija Safari ou Firefox
  recentes, mas não foram testados.
- **Dispositivos reais.** Os testes usam emulação, não telemóveis físicos.
- **Carga.** Não é relevante num sítio estático, mas não foi medida.
- **O CMS em produção.** O `config.yml` é validado automaticamente contra os esquemas de
  conteúdo (`npm run validar:esquemas`) e a página do editor foi testada a carregar com a
  versão fixa e o SRI. Mas a autenticação OAuth só pode ser testada depois de a aplicação
  OAuth existir, e a branch de publicação está por decidir — ver
  [decisoes-pendentes.md](decisoes-pendentes.md).
- **A Content-Security-Policy em produção.** É testada em modo impositivo num navegador
  (`npm run audit:csp`, 15 páginas, 0 violações), mas está a ser servida em `Report-Only` e
  só o Apache a aplica. Ver [seguranca-csp.md](seguranca-csp.md).
- **O `.htaccess` num Apache real.** As regras geradas são verificadas por concordância
  entre ficheiros, não executadas por um Apache. A redireção `/site/…` é confirmada pelo
  teste funcional, mas através das páginas de redireção do Astro.
