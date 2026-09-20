# Auditoria do projeto

Auditoria técnica completa ao repositório, feita em **20 de setembro de 2026**, com dois
objetivos: verificar se a documentação corresponde ao código e deixar toda a documentação
para quem desenvolve em português de Portugal.

**O repositório é a fonte de verdade.** Tudo o que se segue foi verificado no código, nos
ficheiros de configuração ou na execução das ferramentas do projeto. Onde um número não foi
possível confirmar, está dito.

---

## Resumo

O sítio está **em bom estado técnico**. As seis verificações do repositório passam, o build
é reproduzível, a validação de conteúdo funciona e as decisões de arquitetura registadas em
[`arquitetura.md`](arquitetura.md) correspondem ao que está implementado.

A documentação existente era, na sua maior parte, correta e honesta — em particular na
distinção entre o que foi testado automaticamente e o que não foi testado de todo. Os
problemas encontrados são de três tipos:

1. **Números errados** repetidos em vários ficheiros (nomeadamente «189 redireções», que não
   corresponde a nenhum dos três ficheiros de redireções).
2. **Funcionalidades descritas como automáticas quando são manuais** — a mais importante é a
   afirmação de que o sítio se reconstrói sozinho depois de gravar no CMS, o que não
   acontece: não existe CI/CD.
3. **Configuração desatualizada no CMS**: o backend do Decap CMS apontava para um
   repositório com um nome diferente do real, o que impediria o editor de funcionar
   (corrigido), e aponta para uma branch `main` que não existe neste repositório
   (registado, por ser uma decisão da associação).

A documentação para quem desenvolve estava em inglês (README de 552 linhas e 22 páginas de
wiki) e foi traduzida e reescrita em português de Portugal, corrigida contra o código.

---

## Tecnologias encontradas

Versões lidas de `package.json` e `package-lock.json`; entre parênteses, a versão instalada
com `npm ci` à data da auditoria.

| Área | Tecnologia | Versão |
| --- | --- | --- |
| Framework | Astro, em modo estático | `^5.15.10` (5.18.2) |
| Linguagem | TypeScript, `astro/tsconfigs/strict` | `^5.9.3` (5.9.3) |
| Runtime | Node.js | `engines: >=20.3.0`; `.nvmrc`: 22 (22.22.2) |
| Gestor de pacotes | npm | `package-lock.json` (npm 10.9.7) |
| Conteúdo | Astro Content Collections + Zod | incluído no Astro |
| CSS | CSS nativo com `@layer` e custom properties | sem framework |
| CMS | Decap CMS, via CDN | `^3.8.4` |
| Mapas | Leaflet + telas do OpenStreetMap | `^1.9.4` (1.9.4) |
| Pesquisa | Pagefind | `^1.4.0` (1.5.2) |
| Imagens | Sharp (guião à parte, não no build) | `^0.34.4` (0.34.5) |
| QA | Playwright + `@axe-core/playwright` | `^1.63.0` / `^4.13.0` |
| Sitemap / RSS | `@astrojs/sitemap`, `@astrojs/rss` | `^3.6.0` (3.7.4) / `^4.0.12` (4.0.19) |
| Verificação de tipos | `@astrojs/check` | `^0.9.4` (0.9.10) |

**Não existe:** framework de testes unitários, linter (ESLint/Prettier), CI/CD, backend,
base de dados, adaptador de servidor, ficheiro `LICENSE`.

### Dimensão do projeto

| Métrica | Valor |
| --- | --- |
| Ficheiros de rota (`src/pages/`) | 41 (40 `.astro` + `rss.xml.ts`) |
| Componentes (`src/components/`) | 19, todos em uso |
| Layouts | 3 |
| Módulos em `src/lib/` | 6 |
| Coleções de conteúdo | 9 |
| Ficheiros JSON em `src/data/` | 10 (5 coleções + 5 lidos diretamente) |
| Notícias · artigos técnicos · eventos · páginas | 39 · 8 · 17 · 4 |
| Repetidores · balizas · documentos · ligações · FAQ | 9 · 4 · 3 · 8 · 8 |
| Associados · entradas de cronologia | 46 · 72 |
| CSS | 1 ficheiro, 507 linhas |
| Guiões em `scripts/` | 7 (5 com entrada em `package.json`) |
| Páginas HTML geradas | 113 reais + 183 stubs de redireção = 296 |
| Endereços no sitemap | 109 |

---

## Funcionalidades verificadas

Confirmadas no código e, onde aplicável, na execução:

```text
✓ Build estático do Astro (output não definido = 'static'), sem adaptador de servidor
✓ 9 coleções de conteúdo com validação Zod no build
✓ Diretório de repetidores com pesquisa e filtros no cliente (grupos banda/modo)
✓ Vista dupla tabela/cartões, alternada só por CSS, em repetidores, balizas e associados
✓ Distintivos de estado com símbolo e texto (nunca só cor)
✓ Botões de cópia de frequências, com região aria-live e alternativa sem Clipboard API
✓ Balizas CS5BLA em 50, 144, 432 e 1296 MHz
✓ Digipeaters APRS derivados da coleção de repetidores por filtro
✓ Mapa Leaflet diferido por IntersectionObserver, com lista em texto como alternativa
✓ Posições derivadas da quadrícula Maidenhead, sempre assinaladas como aproximadas
✓ Notícias com paginação (12/página) e páginas por categoria
✓ Artigos técnicos com índice, nível e referências
✓ Eventos com estado calculado (futuro/a decorrer/terminado) em dias UTC
✓ Arquivo por ano, com filtro no cliente
✓ Pesquisa Pagefind (108 páginas, 5636 palavras indexadas)
✓ Tema claro e escuro, aplicado antes da primeira pintura, com localStorage em try/catch
✓ prefers-reduced-motion respeitado
✓ Metadados, Open Graph e Twitter Card em todas as páginas
✓ JSON-LD: Organization, BreadcrumbList, NewsArticle, Event, TechArticle, FAQPage,
  HowTo, ContactPage, WebSite (com SearchAction)
✓ sitemap-index.xml com /area-reservada/ excluída
✓ robots.txt a bloquear /admin/ e /area-reservada/
✓ Feed RSS com notícias, artigos e eventos
✓ 183 redireções de rota + 190 regras 301 em cada ficheiro de servidor
✓ Cabeçalhos de segurança e de cache no .htaccess
✓ Decap CMS com todas as coleções configuradas e backend local funcional
✓ Estilos de impressão, incluindo tabela forçada e endereços a seguir às ligações
```

---

## Validação antes das alterações

Executada sobre o commit `a723a81`, com `npm ci` e o build completo.

| Verificação | Comando | Resultado | Detalhe |
| --- | --- | --- | --- |
| Tipos | `npm run check` | **PASSA** | 70 ficheiros, 0 erros, 0 avisos, 8 sugestões |
| Build | `npm run build` | **PASSA** | 296 ficheiros HTML; Pagefind indexou 108 páginas |
| Ligações | `npm run lint:links` | **PASSA** | 5314 internas, 146 âncoras, 0 partidas |
| SEO | `npm run audit:seo` | **PASSA** | 112 páginas, 0 problemas, 9 avisos de título longo |
| QA | `npm run qa` | **PASSA** | 74 análises axe-core, 0 violações; 0 transbordos; 17/17 testes funcionais |
| Desempenho | `npm run audit:desempenho` | **PASSA** | 8 páginas, todas dentro dos limiares de Core Web Vitals |

Observação sobre o QA: cinco erros de consola `net::ERR_TOO_MANY_RETRIES`, nas páginas com
mapa e na de meteorologia espacial. São do ambiente de auditoria, que encaminha o tráfego
externo por um proxy que bloqueia as telas do OpenStreetMap e as imagens do HamQSL. O teste
funcional do mapa, na mesma sessão, confirma que o Leaflet inicializa e coloca marcadores.
Nenhum erro de JavaScript próprio do sítio foi registado.

`npm ci` reporta **3 vulnerabilidades** em dependências (1 crítica, 1 alta, 1 baixa); ver
[Segurança](#segurança).

---

## Problemas encontrados

Severidade: **Crítico** (pode levar alguém a partir, mal configurar ou publicar mal o
projeto) · **Alto** (detalhe importante ausente ou muito errado) · **Médio** (enganador ou
incompleto, sem falha imediata) · **Baixo** (redação, organização, imprecisão menor).

| ID | Severidade | Área | Problema | Fonte de verdade | Ação |
| --- | --- | --- | --- | --- | --- |
| DOC-001 | **Crítico** | CMS | `public/admin/config.yml` tinha `repo: themantas1994/arla`, que não é este repositório. Com este valor, o editor não consegue ler nem gravar. | `git remote -v` → `themantas1994/arla-site` | Corrigido para `themantas1994/arla-site`, aqui e nos dois exemplos de `implantacao.md` |
| DOC-002 | **Crítico** | CMS / Implantação | O cabeçalho do `config.yml` e o `gestao-de-conteudos.md` afirmavam que, depois de gravar, «o sítio é reconstruído automaticamente» e fica visível «em um a dois minutos». Não existe CI/CD: a alteração fica no repositório e não chega ao sítio. | Ausência de `.github/`; publicação manual descrita em `implantacao.md` | Corrigido nos dois ficheiros, com aviso explícito |
| DOC-003 | **Alto** | SEO / Redireções | «189 redireções» repetido no README, em `arquitetura.md`, em `mapa-de-redirecoes.md` e em quatro páginas da wiki. Nenhum ficheiro tem 189 regras. | 183 em `redirects.mjs`; 190 em `.htaccess`; 190 em `_redirects` | Números corrigidos e decompostos em toda a documentação |
| DOC-004 | **Alto** | Redireções | A documentação dizia que os três ficheiros são «gerados a partir da mesma fonte». Não são: são mantidos à mão, e os 6 redirecionamentos de PDF e a regra de recolha só existem nos ficheiros de servidor. | Comparação programática dos três ficheiros | Corrigido; acrescentado aviso de manutenção em três sítios |
| DOC-005 | **Alto** | Implantação | `docs/implantacao.md` apresentava a secção «Publicação automática» com um workflow, sem dizer que não está implementado; a resolução de problemas mandava ver o separador «Actions» do GitHub, que não existe. | Ausência de `.github/` | Secção renomeada para «Publicação automática — NÃO IMPLEMENTADA», com o estado real antes do exemplo |
| DOC-006 | **Alto** | Responsivo | README e `qualidade.md` afirmavam que as tabelas passam a cartões «abaixo de 860 px» e que «todas as tabelas seguem o mesmo padrão». São três breakpoints diferentes (700, 860, 900 px) e a página de arquivo nem sequer usa tabela. | Media queries em `TabelaRepetidores.astro`, `rede/balizas.astro`, `arla/quem-somos.astro`; `arquivo.astro` sem `<table>` | Corrigido; acrescentada a tabela completa de breakpoints |
| DOC-007 | **Médio** | Arquitetura | A documentação não distinguia as 5 coleções JSON validadas por Zod dos 5 ficheiros JSON importados diretamente, sem validação. | `src/content.config.ts` vs. importações em `src/pages/` | Documentado explicitamente, com a consequência prática |
| DOC-008 | **Médio** | Estilos | O README descrevia `global.css` como «~500 linhas» e os breakpoints como «640px, 860px, mais alguns do cabeçalho», omitindo os 17 pontos de rutura em uso. | `wc -l` = 507; levantamento de todas as media queries | Corrigido, com tabela de breakpoints por ficheiro |
| DOC-009 | **Médio** | Media | Documentava-se a otimização de imagens sem deixar claro que **nada** é otimizado no build e que as APIs `<Image>`/`getImage()` não são usadas em lado nenhum. | Ausência de `<Image>` em `src/`; `otimizar-media.mjs` fora do `package.json` | Documentado como «IMPLEMENTADO, fora do build», com a consequência para carregamentos do CMS |
| DOC-010 | **Médio** | Guiões | `scripts/otimizar-media.mjs` e `scripts/regenerar-resumos.mjs` não têm entrada em `package.json` e não estavam documentados como executáveis à mão (o segundo não era mencionado de todo). | `package.json`, `scripts/` | Ambos documentados, com entradas, saídas e aviso de que reescrevem ficheiros |
| DOC-011 | **Médio** | SEO | A lista de tipos de JSON-LD omitia `ContactPage`. | `auditar-seo.mjs` conta 1 `ContactPage`; `src/pages/contactos.astro` | Corrigido |
| DOC-012 | **Médio** | Conteúdo | Não estava documentado que a coleção `paginas` **não gera rotas** e que `radioamadorismo/[pagina].astro` usa um mapa fixo de duas entradas. | `src/pages/radioamadorismo/[pagina].astro` | Documentado em três páginas da wiki |
| DOC-013 | **Médio** | Repetidores | Não estava documentado que os dois digipeaters APRS vivem na coleção `repetidores`, nem que `filtros` incompleto faz um repetidor desaparecer ao filtrar sem qualquer erro. | `repetidores.json`, `rede/aprs.astro`, `TabelaRepetidores.astro` | Documentado, com aviso |
| DOC-014 | **Médio** | Eventos | O README descrevia «Registration» sem deixar claro que `inscricoes` é texto livre e que não existe qualquer sistema de inscrições. | Esquema em `content.config.ts`; ausência de backend | Marcado como PARCIALMENTE IMPLEMENTADO |
| DOC-015 | **Médio** | Segurança | Não havia registo das 3 vulnerabilidades reportadas pelo `npm audit`, nem do facto de o Decap ser carregado de `unpkg.com` sem SRI. | `npm audit`; `public/admin/index.html` | Documentado, com análise de aplicabilidade |
| DOC-016 | **Baixo** | Repositório | README e wiki ligavam para `github.com/themantas1994/arla`. | `git remote -v` | Corrigido em toda a documentação |
| DOC-017 | **Baixo** | SEO | Não estava documentado que o `robots.txt` tem o endereço do sitemap escrito literalmente e não acompanha `PUBLIC_SITE_URL`. | `public/robots.txt` | Documentado |
| DOC-018 | **Baixo** | Ambiente | A tabela de variáveis de ambiente omitia `CHROMIUM_PATH`, usada por três guiões. | `qa.mjs`, `capturas.mjs`, `auditar-desempenho.mjs` | Acrescentada |
| DOC-020 | **Alto** | CMS / Git | `public/admin/config.yml` tem `branch: main`, mas **o repositório não tem uma branch `main`**: a branch predefinida é `claude/arla-website-redesign-vcemm3`. Com o CMS a funcionar, as gravações falhariam. | `git ls-remote --heads origin` | Registado, **não corrigido** — qual deve ser a branch publicada é uma decisão da associação, não uma correção derivável do código |
| DOC-019 | **Baixo** | Idioma | Toda a documentação para quem desenvolve (README + 22 páginas de wiki) estava em inglês, contra o pedido de português de Portugal. | — | README reescrito e wiki substituída por 27 páginas em PT-PT |

---

## Documentação corrigida

### `README.md`

- Reescrito por completo em português de Portugal (552 → 898 linhas), com mais conteúdo
  verificado e cada secção a remeter para a página correspondente da wiki em vez de a
  repetir.
- Contagens de redireções corrigidas e decompostas por ficheiro (DOC-003, DOC-004).
- Secção de implantação separada em **implantação atual**, **alternativas suportadas** e
  **automatização não implementada** (DOC-005).
- Tabela completa de breakpoints, substituindo a afirmação de que existiam dois (DOC-006,
  DOC-008).
- Distinção entre coleções validadas e JSON lido diretamente (DOC-007).
- Otimização de media descrita como executada à mão, fora do build (DOC-009).
- Guiões sem entrada em `package.json` documentados (DOC-010).
- `ContactPage` acrescentado à lista de JSON-LD (DOC-011).
- Secção de segurança com as limitações conhecidas, incluindo o `npm audit` (DOC-015).
- Endereço do repositório corrigido (DOC-016).
- Tabela de variáveis de ambiente completa (DOC-018).

### `docs/implantacao.md`

- Introdução corrigida: a publicação é manual (DOC-005).
- Secção «Publicação automática» renomeada para «— NÃO IMPLEMENTADA», com o estado real
  antes do exemplo de workflow, e nota sobre a consequência para quem edita no CMS.
- Resolução de problemas: deixou de remeter para o separador «Actions» do GitHub.
- `repo:` corrigido nos dois exemplos (DOC-001).

### `docs/gestao-de-conteudos.md`

- Aviso de que o acesso ao `/admin/` em produção depende de OAuth ainda não configurado.
- Correção da afirmação de que o sítio se reconstrói sozinho em um a dois minutos (DOC-002).

### `docs/mapa-de-redirecoes.md`

- Números corrigidos e decompostos por ficheiro (DOC-003).
- Explicação das três correspondências que só existem com o prefixo `/site/`.
- Correção da afirmação de que os três ficheiros são gerados a partir da mesma fonte, com
  aviso de que a manutenção é manual e em triplicado (DOC-004).

### `docs/arquitetura.md`

- Contagem de redireções corrigida (DOC-003).

### `docs/qualidade.md`

- Nota de reverificação de 20/09/2026, com o resultado de todas as ferramentas.
- Correção da afirmação sobre o breakpoint único das tabelas, com os três valores reais
  (DOC-006).
- Erros de consola: registado que o número varia com o ambiente (7 na medição original, 5 na
  reverificação), o que reforça a conclusão de que a causa é externa.

### `docs/auditoria-do-projeto.md`

- Este ficheiro (novo).

### `wiki/`

As 19 páginas em inglês foram substituídas por **27 páginas em português de Portugal**,
todas verificadas contra o código:

```text
Home · Arquitetura · Estrutura-do-Projeto · Desenvolvimento-Local · Gestao-de-Conteudos
Colecoes-de-Conteudo · Sistema-de-Repetidores · Balizas-e-Rede · Noticias-e-Artigos
Eventos · CMS-Decap · Media-e-Imagens · Componentes · Sistema-de-Design
Design-Responsivo · Rotas · SEO · Acessibilidade · Desempenho · Redirecionamentos
Testes-e-Qualidade · Variaveis-de-Ambiente · Seguranca · Implantacao · CI-CD
Resolucao-de-Problemas · Contribuir
(mais README.md e _Sidebar.md)
```

### Código e configuração

Apenas duas alterações, ambas correções de defeitos de configuração diretamente ligados à
documentação:

- `public/admin/config.yml`: `repo` corrigido para `themantas1994/arla-site` (DOC-001) e
  comentário de cabeçalho corrigido, por afirmar que o sítio se reconstrói sozinho (DOC-002).

**Nenhum ficheiro de conteúdo, nenhuma frequência, nenhum indicativo e nenhum dado da
associação foi alterado.** Nenhuma alteração ao CSS, aos componentes, às páginas ou aos
esquemas.

---

## Funcionalidades documentadas mas não implementadas

```text
NÃO IMPLEMENTADO — Pipeline CI/CD
  Não existe .github/ nem qualquer sistema de integração contínua. A documentação
  anterior apresentava um workflow proposto sem o rotular como tal.

NÃO IMPLEMENTADO — Publicação automática a partir do CMS
  Gravar no /admin/ faz commit no repositório; o sítio só muda quando alguém corre o
  build e publica dist/ à mão.

NÃO IMPLEMENTADO — Otimização de imagens durante o build
  astro.config.mjs tem definições `image`, mas nenhuma página usa <Image> ou getImage().
  As imagens são servidas tal como estão no repositório.

NÃO IMPLEMENTADO — Content-Security-Policy
  Assumido como tal na documentação anterior, e confirmado: não há cabeçalho CSP.

NÃO IMPLEMENTADO — Área reservada com autenticação
  /area-reservada/ é uma página estática que explica que o sistema de contas do
  WordPress não transitou. Os endereços antigos de login/registo redirecionam para lá.

NÃO IMPLEMENTADO — Testes unitários
  Não há Vitest, Jest nem qualquer ficheiro de teste.

NÃO IMPLEMENTADO — Linter
  Não há ESLint nem Prettier configurados.

NÃO IMPLEMENTADO — Internacionalização
  O sitemap declara i18n com um único locale (pt-PT). Não há conteúdo nem rotas noutro
  idioma.

NÃO IMPLEMENTADO — Sistema de inscrições em eventos
  O campo `inscricoes` é texto livre; não há formulário nem backend.

PARCIALMENTE IMPLEMENTADO — Autenticação do Decap CMS em produção
  O config.yml está completo e o backend local funciona, mas a aplicação OAuth do GitHub
  e o serviço de autenticação não existem. Até lá, o /admin/ carrega mas não autentica.
  Além disso, `branch: main` não corresponde a nenhuma branch existente (DOC-020).
```

## Funcionalidades implementadas mas não documentadas

```text
+ scripts/regenerar-resumos.mjs — regenera o campo `resumo` a partir do próprio texto,
  saltando saudações e autoria. Não constava de nenhuma documentação.
+ Variável CHROMIUM_PATH, usada por três guiões de QA.
+ JSON-LD ContactPage em /contactos/.
+ Comportamento de rascunhos: `rascunho: true` é visível em `npm run dev` e excluído do
  build de produção (import.meta.env.DEV em src/lib/conteudo.ts).
+ Navegação sequencial (anterior/seguinte) em notícias, artigos e eventos, passada pelas
  props de getStaticPaths().
+ Cabeçalhos de cache (`max-age=31536000, immutable`) no .htaccess, além dos de segurança.
+ prefetch: { prefetchAll: true, defaultStrategy: 'hover' } em astro.config.mjs.
+ cssTarget limitado a Chrome 107 / Safari 16 / Firefox 110.
+ Delegação de eventos em BotaoCopiar.astro (um ouvinte por página, via window.__arlaCopiar)
  e alternativa para navegadores sem Clipboard API.
+ Prop `nivel` em CartaoArtigo.astro, que existe para manter a hierarquia de títulos.
+ Realce da secção em leitura no índice de conteúdos, por IntersectionObserver e aria-current.
+ A pesquisa de repetidores compara texto sem acentos através de uma cadeia pré-calculada
  por linha (data-texto).
```

---

## Dívida técnica

Nenhum destes pontos foi corrigido nesta auditoria: são registo, não trabalho feito.

| ID | Descrição | Impacto | Prioridade | Ação sugerida |
| --- | --- | --- | --- | --- |
| DT-001 | As redireções são mantidas à mão em três ficheiros (`redirects.mjs`, `.htaccess`, `_redirects`), sem geração nem verificação | Uma redireção acrescentada só num dos ficheiros comporta-se de forma diferente consoante o alojamento | **Alta** | Gerar `.htaccess` e `_redirects` a partir de `redirects.mjs`, com um guião no `package.json`, ou pelo menos acrescentar uma verificação de concordância a `npm run lint:links` |
| DT-002 | `public/admin/config.yml` e `src/content.config.ts` descrevem os mesmos dados sem verificação de concordância | O CMS pode gravar conteúdo que o build recusa | **Alta** | Verificação automática dos campos e dos valores de enum entre os dois ficheiros |
| DT-003 | Nenhum teste unitário para a lógica pura: `estadoEvento()`, `quadriculaParaCoordenadas()`, `relacionados()`, `intervaloDatas()`, `slugCategoria()`, `tempoLeitura()` | Uma regressão nestas funções só é apanhada por inspeção visual | **Alta** | Acrescentar uma suite mínima (Vitest), começando por `maidenhead.ts` e `sitio.ts` |
| DT-004 | 3 vulnerabilidades em dependências (`astro` crítica, `sharp` alta, `esbuild` baixa) | Baixo neste sítio em concreto (ver [Segurança](#segurança)), mas cresce com o tempo | **Alta** | Planear a atualização de versão maior, com verificação completa a seguir |
| DT-005 | `POR_PAGINA = 12` está duplicado em `src/pages/noticias/pagina/[pagina].astro`: a constante e um `12` literal dentro de `getStaticPaths()` | Alterar só um gera páginas a mais ou a menos | Média | Usar a constante nos dois sítios |
| DT-006 | `Artigo.astro` declara a prop `tipoArtigo` e nunca a lê; as três páginas de detalhe passam-na | Confunde quem lê o layout | Média | Usar ou remover, nos quatro ficheiros |
| DT-007 | Lógica de capturas de ecrã duplicada entre `scripts/qa.mjs --capturas` (37 páginas) e `scripts/capturas.mjs` (16 páginas) | Duas implementações a divergir | Média | Manter uma só |
| DT-008 | 8 sugestões do `astro check`: importações e variáveis não usadas em 7 ficheiros, mais um uso de `document.execCommand` (obsoleto, mas intencional como alternativa) | Ruído nas verificações | Baixa | Limpar as importações |
| DT-009 | Os cinco ficheiros JSON fora das coleções (`sitio`, `orgaos-sociais`, `direcao-tecnica`, `associados`, `cronologia`) não têm validação de esquema | Um erro de digitação aparece como `undefined` na página, sem falhar o build | Média | Passá-los a coleções com `file()` e esquema Zod, ou validá-los num guião |
| DT-010 | `public/imagens/conteudo/` tem `hamRadio.mp4` e `hamradio.mp4` — nomes que só diferem em maiúsculas | Ambíguo em sistemas de ficheiros que ignoram maiúsculas (macOS, Windows); risco de um sobrepor o outro | Média | Verificar se ambos são usados e renomear, acrescentando redireção se algum for referenciado publicamente |
| DT-011 | `.so-largo` / `.so-estreito` repetidas em três ficheiros, com três breakpoints | Um padrão partilhado sem sítio partilhado | Baixa | Passar para `global.css` com custom property para o breakpoint |
| DT-012 | `ROTAS` e o array de `getStaticPaths()` repetem as mesmas chaves em `radioamadorismo/[pagina].astro` | Acrescentar uma página exige alterar dois sítios no mesmo ficheiro | Baixa | Derivar `getStaticPaths()` de `Object.keys(ROTAS)` |
| DT-013 | Não existe ficheiro `LICENSE` | Estado legal do código indefinido | Média | Decisão da direção da associação |
| DT-014 | O `tamanho` dos documentos é escrito à mão e não é verificado contra o ficheiro | Pode ficar desatualizado ao substituir um PDF | Baixa | Calcular no build, ou verificar num guião |

Registados como defeitos observados, não corrigidos por estarem fora do âmbito desta tarefa:

```text
BUG-001
Severidade: Baixa
Local: src/lib/rede.ts, linha ~28
Descrição: `tipo: d.filtros.includes('aprs') ? 'repetidor' : 'repetidor'` — os dois ramos
           devolvem o mesmo valor.
Impacto: Nenhum visível. Os digipeaters APRS aparecem no mapa com a cor dos repetidores,
         que é o comportamento atual e é aceitável; a condição é que não faz nada.
Recomendação: Ou distinguir os APRS com um tipo e cor próprios (e acrescentar a legenda),
              ou remover a condição.

BUG-002
Severidade: Baixa
Local: src/components/TabelaRepetidores.astro, função aplicar()
Descrição: A contagem de resultados elimina duplicados com um Set sobre `data-texto`.
           Dois repetidores com exatamente o mesmo texto pesquisável contariam como um.
Impacto: Nenhum com os dados atuais (os 9 registos têm textos distintos).
Recomendação: Usar o `id` do repetidor em vez do texto.
```

---

## Segurança

### Proteções verificadas

- **Sem segredos no repositório** — pesquisa exaustiva por `process.env`,
  `import.meta.env`, `PUBLIC_` e `.env*`: a única variável é `PUBLIC_SITE_URL`, que é um
  endereço público.
- **Sem código a correr no servidor** e sem base de dados em produção.
- **Autenticação delegada ao GitHub** (OAuth) — o sítio nunca vê palavras-passe.
- **Cabeçalhos de segurança** no `.htaccess`: `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Permissions-Policy`, `Strict-Transport-Security`.
- **Sem HTML de utilizador por sanear** — todo o conteúdo é Markdown de quem tem acesso de
  escrita, processado no build.
- **Ligações externas** com `rel="noopener noreferrer"`; os painéis externos com
  `referrerpolicy="no-referrer"`.
- **Validação de conteúdo** que faz falhar o build.

### Lacunas

- **Não existe `Content-Security-Policy`.** É a lacuna mais relevante. Tem de ser afinada
  contra o alojamento real, por causa do OpenStreetMap, dos painéis de meteorologia espacial,
  do `unpkg.com` e dos scripts em linha de `Base.astro`.
- **O Decap CMS é carregado de `https://unpkg.com` sem Subresource Integrity**, e com um
  intervalo de versões (`^3.8.4`) em vez de uma versão fixa.
- **Os cabeçalhos de segurança só existem no Apache** — qualquer outro alojamento teria de os
  replicar, e nada no repositório o assinala fora da documentação.
- **`npm audit`: 3 vulnerabilidades.** Análise de aplicabilidade a este projeto:

  | Pacote | Gravidade | Aplicabilidade |
  | --- | --- | --- |
  | `astro` | Crítica | **Maioritariamente não aplicável.** Os avisos dizem respeito a `define:vars`, server islands, View Transitions, atributos em spread, nomes de slot, SSRF em página de erro pré-renderizada e RCE por otimização AVIF — nada disso é usado aqui, e o build é estático a partir de conteúdo do próprio repositório |
  | `sharp` | Alta | Aplicável **apenas** a quem corra `scripts/otimizar-media.mjs` sobre imagens não fidedignas. Não corre no build nem em produção |
  | `esbuild` | Baixa | Apenas no servidor de desenvolvimento, no Windows |

  A correção exige `npm audit fix --force`, que instalaria versões maiores de `astro` e
  `sharp` — uma migração, fora do âmbito de uma auditoria de documentação.

### Recomendações

1. Concluir a configuração do OAuth do CMS e testar o fluxo real.
2. Acrescentar uma CSP, começando em `report-only`.
3. Fixar a versão do Decap CMS e acrescentar `integrity`, ou servir o ficheiro do próprio
   domínio.
4. Planear a atualização de `astro` e `sharp`.
5. Rever periodicamente quem tem acesso de escrita ao repositório — é essa lista que define
   quem pode publicar.

---

## Acessibilidade

### Verificado automaticamente

`npm run qa`, com axe-core e os conjuntos `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa` e `best-practice`: **74 análises (37 páginas × 2 temas), 0 violações**, 0
transbordos horizontais entre 320 e 1440 px, nenhum alvo de toque abaixo de 24 px a 375 px.

### Verificado estruturalmente no código

Landmarks semânticos; um só `<h1>` por página; `lang="pt-PT"`; ligação «saltar para o
conteúdo»; submenus operáveis por clique e teclado com `Escape` a fechar; `:focus-visible`
de 3 px; tabelas com `<caption>`, `<thead>` e `scope`; vista em cartões em ecrãs estreitos;
estado com símbolo e texto; região `aria-live` para a cópia de frequências; alternativa em
texto para todos os mapas; `prefers-reduced-motion` respeitado; alvos de toque de 44 px nos
controlos principais; `localStorage` sempre dentro de `try`/`catch`.

### Não testado

Leitores de ecrã reais (NVDA, JAWS, VoiceOver); navegação exclusivamente por teclado por um
utilizador habitual; compreensão do texto por pessoas com dificuldades de leitura;
navegadores além do Chromium; dispositivos físicos; ampliação a 200 % e 400 %; modo de alto
contraste do sistema operativo.

**Conclusão:** o projeto **não declara conformidade WCAG 2.2 AA**, e não deve declarar. Um
resultado de 0 violações no axe-core verifica estrutura, não usabilidade. A documentação
anterior já era honesta neste ponto; a nova mantém essa separação e torna-a mais explícita.

---

## Desempenho

Medido com `npm run audit:desempenho`: 8 páginas a 390 px, 4G lento (1,6 Mbit/s, 150 ms),
CPU 4× mais lento, cache fria.

| Métrica | Resultado |
| --- | --- |
| LCP | Entre 472 e 656 ms (limiar: 2500 ms) |
| CLS | 0 em todas as páginas |
| Peso | Entre 87 e 273 kB |
| Pedidos | Entre 4 e 8 |
| Pedidos a terceiros | 0 |
| JavaScript na página inicial | 5 kB |
| Tipos de letra descarregados | 0 |

**Todas as páginas ficam abaixo de um terço do limiar de LCP.** A origem destes números é
arquitetural — HTML estático, sem hidratação, sem tipos de letra externos, mapas e pesquisa
diferidos — e não otimizações frágeis.

O ponto a vigiar é o peso das imagens: **não há otimização no build**, e um ficheiro
carregado pelo CMS é servido tal como foi enviado.

---

## SEO

| Verificação | Resultado |
| --- | --- |
| Páginas analisadas | 112 (4 com `noindex`, todas utilitárias) |
| Problemas | 0 |
| Avisos | 9 (títulos acima de 65 caracteres, todos nomes reais de eventos) |
| Endereços no sitemap | 109 |
| `robots.txt` | Presente, bloqueia `/admin/` e `/area-reservada/` |
| Título, descrição, canónico, OG, Twitter Card | Em todas as páginas |
| Idioma `pt-PT` | Em todas as páginas |
| JSON-LD | 9 tipos distintos, 290 blocos no total |
| Feed RSS | Presente, com notícias, artigos e eventos |
| Redireções | 183 rotas + 190 regras por ficheiro de servidor; sem ciclos nem cadeias |

Verificações específicas feitas nesta auditoria sobre as redireções: **nenhuma
auto-redireção, nenhum ciclo e nenhum destino que seja origem de outra regra**. Os destinos
coincidem regra a regra nos três ficheiros.

Ponto a corrigir um dia: o `robots.txt` tem o endereço do sitemap escrito literalmente e não
acompanha `PUBLIC_SITE_URL`.

---

## Implantação

### Situação atual

**Apache com cPanel**, com publicação **manual**: `npm run build` seguido do envio do
conteúdo de `dist/` para a raiz pública, incluindo o ficheiro oculto `.htaccess`.

### Alternativas suportadas, não utilizadas

Netlify e Cloudflare Pages (leem `_redirects` automaticamente); Vercel (não lê
`_redirects` — precisaria de `vercel.json`); GitHub Pages (sem redireções ao nível do
servidor).

### Não implementado

Publicação automática. Não existe `.github/` nem qualquer sistema de CI/CD. A proposta de
workflow em `docs/implantacao.md` está agora explicitamente rotulada como tal.

### Consequência prática

Enquanto não houver publicação automática, **uma alteração gravada no CMS fica no
repositório sem chegar ao sítio**. Era esta a afirmação incorreta mais consequente da
documentação anterior (DOC-002).

---

## Validação depois das alterações

| Verificação | Comando | Resultado |
| --- | --- | --- |
| Tipos | `npm run check` | **PASSA** — 0 erros, 0 avisos, 8 sugestões (iguais à baseline) |
| Build | `npm run build` | **PASSA** — 296 ficheiros HTML, Pagefind com 108 páginas |
| Ligações | `npm run lint:links` | **PASSA** — 0 ligações internas partidas |
| SEO | `npm run audit:seo` | **PASSA** — 0 problemas, 9 avisos (iguais à baseline) |

As alterações desta auditoria são de documentação, com duas exceções em
`public/admin/config.yml` que não afetam o build. Os resultados são idênticos aos da
baseline.

---

## Ficheiros alterados

```text
README.md                        reescrito em PT-PT e corrigido contra o código
docs/auditoria-do-projeto.md     novo
docs/implantacao.md              CI/CD rotulado como não implementado; repo corrigido
docs/gestao-de-conteudos.md      correção sobre publicação automática e OAuth
docs/mapa-de-redirecoes.md       contagens corrigidas; manutenção manual explicitada
docs/arquitetura.md              contagem de redireções corrigida
docs/qualidade.md                nota de reverificação; breakpoints corrigidos
public/admin/config.yml          repo corrigido; comentário de cabeçalho corrigido

wiki/  (removidos, em inglês)
  Accessibility.md · Architecture.md · Articles-and-News.md · CI-CD.md · Components.md
  Content-Management.md · Contributing.md · Deployment.md · Events.md
  Local-Development.md · Performance.md · Project-Structure.md · Repeater-Data.md
  Routing.md · SEO.md · Security.md · Styling-and-Design-System.md · Testing.md
  Troubleshooting.md

wiki/  (novos ou reescritos, em PT-PT)
  Home.md · README.md · _Sidebar.md · Arquitetura.md · Estrutura-do-Projeto.md
  Desenvolvimento-Local.md · Gestao-de-Conteudos.md · Colecoes-de-Conteudo.md
  Sistema-de-Repetidores.md · Balizas-e-Rede.md · Noticias-e-Artigos.md · Eventos.md
  CMS-Decap.md · Media-e-Imagens.md · Componentes.md · Sistema-de-Design.md
  Design-Responsivo.md · Rotas.md · SEO.md · Acessibilidade.md · Desempenho.md
  Redirecionamentos.md · Testes-e-Qualidade.md · Variaveis-de-Ambiente.md
  Seguranca.md · Implantacao.md · CI-CD.md · Resolucao-de-Problemas.md · Contribuir.md
```

**Não foi alterado nenhum ficheiro de conteúdo**, nenhum dado da associação, nenhuma
frequência, nenhum indicativo, nenhum documento legal e nenhum componente, página, estilo
ou esquema.

---

## Recomendações futuras

Separadas do que está feito. Nenhuma foi implementada.

### Imediato

1. **Concluir a configuração do OAuth do Decap CMS** (aplicação OAuth do GitHub + serviço de
   autenticação). Sem isto, o editor não funciona em produção e a promessa feita à direção
   não se cumpre.
2. **Decidir qual é a branch publicada e acertar `branch:` no `config.yml`** (DOC-020). Hoje
   o ficheiro diz `main`, e o repositório não tem uma branch com esse nome — a predefinida é
   `claude/arla-website-redesign-vcemm3`. Com o CMS a funcionar, as gravações falhariam.
3. **Confirmar os dados assinalados em
   [`carece-de-verificacao.md`](carece-de-verificacao.md)** — mandato dos órgãos sociais,
   valor da quota, IBAN. São factos publicados que vieram do sítio anterior.
4. **Decidir sobre o ficheiro `LICENSE`** (DT-013).

### Curto prazo

4. **Gerar `.htaccess` e `_redirects` a partir de `redirects.mjs`**, ou pelo menos verificar
   a concordância automaticamente (DT-001).
5. **Verificar a concordância entre `config.yml` e `content.config.ts`** (DT-002).
6. **Acrescentar testes unitários** para a lógica pura de `src/lib/` (DT-003).
7. **Implementar o workflow de CI/CD**, com `npm run check`, `build`, `lint:links` e `qa` —
   e, sobretudo, com o passo de publicação, que é o que fecha a lacuna entre o CMS e o sítio.
8. **Acrescentar uma `Content-Security-Policy`** afinada ao alojamento.

### Futuro

9. **Atualizar `astro` e `sharp`** para as versões maiores, com verificação completa (DT-004).
10. **Otimizar imagens no build**, passando a usar `<Image>` do Astro — resolveria o problema
    dos carregamentos do CMS de uma vez.
11. **Validar com esquema os cinco ficheiros JSON fora das coleções** (DT-009).
12. **Testar com leitores de ecrã reais** e com utilizadores — é o que falta para poder falar
    de conformidade WCAG, e não é trabalho que se automatize.
13. **Unificar a geração de capturas de ecrã** (DT-007) e limpar a dívida menor (DT-005,
    DT-006, DT-008, DT-010, DT-011, DT-012, DT-014).

---

## Estado

```text
DOCUMENTAÇÃO: COMPLETA COM PENDÊNCIAS
```

A documentação pedida está feita e verificada: o README e as 27 páginas da wiki estão em
português de Portugal, corrigidos contra o código, com as funcionalidades implementadas
claramente separadas das propostas, e esta auditoria regista o que foi inspecionado, o que
foi encontrado e o que foi alterado.

As pendências não são de documentação, e por isso não foram resolvidas aqui:

- a autenticação do Decap CMS em produção continua por configurar (fora do repositório), e
  a branch publicada continua por decidir (DOC-020);
- as 14 entradas de dívida técnica e os dois defeitos acima continuam por corrigir, por
  serem alterações de código fora do âmbito desta tarefa;
- as 3 vulnerabilidades de dependências exigem atualizações de versão maior;
- os factos assinalados em [`carece-de-verificacao.md`](carece-de-verificacao.md) continuam
  a precisar de confirmação de alguém da direção da associação — nenhum deles pode ser
  resolvido a partir do código.
