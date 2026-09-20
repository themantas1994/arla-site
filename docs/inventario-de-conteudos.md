# Inventário de conteúdos do sítio anterior

Auditoria completa de `https://www.cs5arla.pt/site/`, feita antes de qualquer decisão de
arquitetura. Base: `wp-sitemap.xml` (27 páginas, 61 artigos, 3 categorias), navegação do
tema, rodapé e ligações internas, tudo descarregado e analisado.

**Resumo:** 88 páginas públicas, todas tratadas. Nada foi eliminado.

| Destino | Quantidade |
| --- | --- |
| Migrado para a nova estrutura | 69 |
| Substituído por dados estruturados | 6 |
| Reconstruído como página nova | 7 |
| Consolidado noutra página | 6 |
| Removido com redireção (sem conteúdo próprio) | 7 |

---

## 1. Páginas institucionais

| URL antigo | Título | Tipo | Decisão | URL novo |
| --- | --- | --- | --- | --- |
| `/site/` | ARLA (início) | Lista de artigos | **Reconstruído** — página inicial nova, com herói, notícias, rede, eventos, adesão e contactos | `/` |
| `/site/associacao/` | Associação | Texto | **Migrado** integralmente | `/arla/` |
| `/site/historial/` | Historial | Tabela HTML de 73 linhas | **Dados estruturados** — passou a `cronologia.json` e é apresentado como linha do tempo navegável por ano | `/arla/historia/` |
| `/site/quem-somos/` | Quem somos | Tabela de 46 associados | **Dados estruturados** — `associados.json`, com filtro e vista em cartões no telemóvel | `/arla/quem-somos/` |
| `/site/orgaos-sociais/` | Órgãos Sociais | Texto corrido | **Dados estruturados** — `orgaos-sociais.json`, apresentado em cartões por órgão | `/arla/orgaos-sociais/` |
| `/site/direcao-tecnica/` | Direção Técnica | Lista | **Dados estruturados** — `direcao-tecnica.json`, cartões por área | `/arla/direcao-tecnica/` |
| `/site/ser-associado/` | Ser associado/a | Texto | **Reconstruído** — mesmo conteúdo factual, apresentado em seis passos numerados | `/arla/ser-associado/` |
| `/site/quotizacao/` | Quotização | Texto com IBAN | **Reconstruído** — valor em destaque, IBAN/NIB com botão de cópia, instruções numeradas | `/arla/quotizacao/` |
| `/site/contactos/` | Contactos | Texto | **Reconstruído** — morada, correio protegido de spam, dados de estação copiáveis, mapa | `/contactos/` |
| `/site/aviso-legal/` | Aviso legal | Texto | **Migrado** sem qualquer alteração ao texto | `/legal/aviso-legal/` |

## 2. Rede — repetidores e balizas

| URL antigo | Título | Tipo | Decisão | URL novo |
| --- | --- | --- | --- | --- |
| `/site/repetidores/` | Repetidores | Tabela HTML de 9 linhas | **Dados estruturados** — `repetidores.json`; tabela com pesquisa, filtros por banda e modo, botões de cópia, cartões no telemóvel e mapa | `/rede/repetidores/` |
| `/site/balizas/` | Balizas | Tabela HTML de 4 linhas | **Dados estruturados** — `balizas.json`, com as mesmas capacidades | `/rede/balizas/` |
| `/site/euc-cs5arla/` | CS5ARLA | **Página vazia** (só o título) | **Reconstruído** — ficha do indicativo com o que é verificável noutras páginas, e nota assinalando o que falta | `/rede/cs5arla/` |
| — | — | — | **Página nova** — APRS, extraído dos dois digipeaters que estavam na tabela de repetidores | `/rede/aprs/` |
| — | — | — | **Página nova** — mapa da rede, com posições derivadas das quadrículas publicadas | `/rede/mapa/` |
| — | — | — | **Página nova** — índice da rede com estado de todas as estações | `/rede/` |

## 3. Radioamadorismo

| URL antigo | Título | Tipo | Decisão | URL novo |
| --- | --- | --- | --- | --- |
| `/site/radioamador/` | Radioamador | Texto + vídeo | **Migrado**, com o vídeo recuperado e alojado localmente | `/radioamadorismo/ser-radioamador/` |
| `/site/radioamadorismo-o-que-e/` | Radioamadorismo o que é? | Texto longo | **Migrado** integralmente, com a autoria preservada | `/radioamadorismo/o-que-e/` |
| `/site/indices-propagacao/` | Meteorologia Espacial | Painéis externos | **Reconstruído** — painéis do HamQSL e NOAA mantidos (as imagens da Rice University já não respondiam), com glossário dos índices | `/radioamadorismo/meteorologia-espacial/` |
| `/site/qo-100_1/` | Satélite QO-100 (1) | Artigo técnico | **Migrado** como artigo técnico, com autor e indicativo | `/tecnica/qo-100-como-receber/` |
| `/site/satelite-qo-100-2/` | Satélite QO-100 (2) | Artigo técnico | **Migrado** como artigo técnico | `/tecnica/qo-100-kg-stv/` |
| `/site/estacao-portatil-qo-100/` | Estação Portátil QO-100 | Artigo técnico | **Migrado** como artigo técnico | `/tecnica/qo-100-estacao-portatil/` |
| — | — | — | **Página nova** — «Quero começar», para quem acaba de descobrir o tema | `/radioamadorismo/comecar/` |
| — | — | — | **Página nova** — índice de satélites e QO-100 | `/radioamadorismo/satelites/` |
| — | — | — | **Página nova** — índice do radioamadorismo, com percursos separados para novatos e experientes | `/radioamadorismo/` |

## 4. Listagens e categorias

| URL antigo | Título | Decisão | URL novo |
| --- | --- | --- | --- |
| `/site/noticias/` | As nossas Actividades | **Consolidado** — era uma segunda listagem dos mesmos artigos da página inicial | `/noticias/` |
| `/site/category/geral/` | Categoria «geral» (58 de 61 artigos) | **Consolidado** — a categoria não distinguia nada; o conteúdo foi reclassificado em categorias com significado | `/noticias/` |
| `/site/category/sstv/` | Categoria «sstv» | **Consolidado** — todo o conteúdo de SSTV passou a evento | `/eventos/` |
| `/site/category/actividades/` | Categoria «actividades» | **Consolidado** | `/noticias/categoria/atividades/` |
| `/site/page/2/` … `/site/page/7/` | Paginação do WordPress | **Consolidado** na nova paginação | `/noticias/` |
| `/site/feed/` | Feed RSS | **Migrado** — feed novo com notícias, artigos e eventos | `/rss.xml` |

## 5. Páginas de conta do WordPress

Sete páginas geradas por um plugin de utilizadores. Nenhuma tinha conteúdo próprio; a
`/site/members/` mostrava apenas dois botões de alternância de vista, sem qualquer lista.
Como o novo sítio é estático e não guarda contas, todas apontam para uma página que
explica a situação — nenhuma ligação fica partida.

| URL antigo | Decisão | URL novo |
| --- | --- | --- |
| `/site/login/`, `/site/logout/`, `/site/register/`, `/site/account/`, `/site/user/`, `/site/members/`, `/site/password-reset/` | **Removido com redireção** | `/area-reservada/` |

## 6. Ficheiros

| URL antigo | Decisão | URL novo |
| --- | --- | --- |
| `/site/estatutos_arla.pdf` | **Migrado** para o repositório, sem alteração ao ficheiro | `/documentos/estatutos-arla.pdf` |
| `/site/regulamentos_internos.pdf` | **Migrado** sem alteração | `/documentos/regulamentos-internos.pdf` |
| `/site/ARLA_ficha_de_inscrição.pdf` | **Migrado** sem alteração, com nome sem acentos | `/documentos/arla-ficha-de-inscricao.pdf` |
| 99 imagens e 2 vídeos em `wp-content/uploads/` | **Migrados** e otimizados | `/imagens/conteudo/` |

## 7. Ligações externas do sítio antigo

| Ligação | Estado verificado | Decisão |
| --- | --- | --- |
| `https://www.facebook.com/ARLAOficial/` | Ativa | **Preservada** — no rodapé, na página de contactos e nas ligações úteis |
| `http://arla.org.pt/index1.html` («Site Antigo», no cabeçalho de todas as páginas) | **Domínio não resolve em DNS** | **Removida** — ver [arquitetura.md](arquitetura.md#decisão-5--o-sítio-antigo-em-arlaorgpt) |
| `http://radio-amador.net/…/listinfo/cluster` | Ativa | **Preservada** nas ligações úteis |
| `http://wordpress.org/`, `cryoutcreations.eu` (créditos do tema) | — | **Removidas** — deixaram de fazer sentido |

## 8. Artigos (61) e páginas convertidas em artigos (3)

Todos migrados. Reclassificados por tipo, porque no WordPress 58 dos 61 estavam na
mesma categoria «geral».

| URL antigo | Título | Novo tipo | Decisão | URL novo |
| --- | --- | --- | --- | --- |
| `/site/2017/07/11/emissoes-em-sstv-08072017/` | Emissões em SSTV 08/07/2017 | Evento | Migrado | `/eventos/emissoes-sstv-2017-07-08/` |
| `/site/2017/08/04/5-o-ciclo-raid/` | 5.º Ciclo-Raid | Notícia | Migrado | `/noticias/5-ciclo-raid/` |
| `/site/2017/08/09/emissoes-em-sstv-sabado-1282017/` | Emissões em SSTV 12/08/2017 via CQ0VARB | Evento | Migrado | `/eventos/emissoes-sstv-2017-08-12/` |
| `/site/2017/10/06/emissoes-em-dsstv-msk-e-4lfsk-via-cq0varb-sabado-07102017/` | Emissões em DSSTV (MSK e 4LFSK) via CQ0VARB, 07/10/2017 | Evento | Migrado | `/eventos/emissoes-dsstv-2017-10-07/` |
| `/site/2017/10/16/jamboree-cs5asa-agrupamento-581-cne/` | Jamboree no Ar \| CS5ASA \| Agrup. 581 C.N.E. | Evento | Migrado | `/eventos/jamboree-no-ar-2017-cs5asa/` |
| `/site/2017/10/23/7a-edicao-do-dia-da-amplitude-modulada/` | 7ª Edição do Dia da Amplitude Modulada | Evento | Migrado | `/eventos/7a-edicao-fim-de-semana-am/` |
| `/site/2017/11/03/neamwave17/` | Exercício NEAMWAVE17 | Notícia | Migrado | `/noticias/exercicio-neamwave17/` |
| `/site/2017/11/10/sstv-11-nov-arrabida-1457375-mhz/` | Emissões em SSTV 11/11/2017 via CQ0VARB | Evento | Migrado | `/eventos/emissoes-sstv-2017-11-11/` |
| `/site/2017/11/23/participacao-na-feira-arvm/` | Participação na Feira da Rádio da ARVM 2017 | Notícia | Migrado | `/noticias/participacao-feira-radio-arvm-2017/` |
| `/site/2017/12/20/boas-festas-2017/` | Boas Festas 2017 | Notícia | Migrado | `/noticias/boas-festas-2017/` |
| `/site/2018/05/08/torre-aldeia-dos-chaos/` | Instalações em Aldeia dos Chãos | Notícia | Migrado | `/noticias/torre-aldeia-dos-chaos/` |
| `/site/2018/05/16/regulamento-geral-de-proteccao-de-dados/` | Regulamento Geral de Protecção de Dados | Notícia | Migrado | `/noticias/regulamento-geral-de-protecao-de-dados/` |
| `/site/2018/05/21/demolicao-da-torre-santiago-do-cacem/` | Demolição da torre em Aldeia dos Chãos | Notícia | Migrado | `/noticias/demolicao-da-torre-em-aldeia-dos-chaos/` |
| `/site/2018/05/23/noite-digital-psk-ros-vhf/` | Noite digital PSK + ROS VHF | Evento | Migrado | `/eventos/noite-digital-psk-ros-vhf-2018/` |
| `/site/2018/08/18/instalacoes-em-aldeia-dos-chaos/` | Instalações em Aldeia dos Chãos | Notícia | Migrado | `/noticias/instalacoes-em-aldeia-dos-chaos-2018-08/` |
| `/site/2018/08/30/instalacoes-em-aldeia-dos-chaos-2/` | Instalações em Aldeia dos Chãos | Notícia | Migrado | `/noticias/instalacoes-em-aldeia-dos-chaos-2018-08-30/` |
| `/site/2018/10/14/instalacoes-em-aldeia-dos-chaos-3/` | Instalações em Aldeia dos Chãos | Notícia | Migrado | `/noticias/instalacoes-em-aldeia-dos-chaos-2018-10/` |
| `/site/2018/12/19/boas-festas-2018/` | Boas Festas 2018 | Notícia | Migrado | `/noticias/boas-festas-2018/` |
| `/site/2019/01/27/instalacoes-em-aldeia-dos-chaos-4/` | Instalações em Aldeia dos Chãos | Notícia | Migrado | `/noticias/instalacoes-em-aldeia-dos-chaos-2019-01/` |
| `/site/2019/03/19/actividade-dmr-em-simplex/` | Divulgação: Actividade DMR em simplex | Evento | Migrado | `/eventos/atividade-dmr-em-simplex-2019/` |
| `/site/2019/03/19/encontro-dmr/` | Divulgação: Almoço convívio dos utilizadores de Voz Digital | Notícia | Migrado | `/noticias/almoco-convivio-voz-digital/` |
| `/site/2019/03/21/repetidor-de-vhf-de-aldeia-dos-chaos-em-testes/` | Repetidor de VHF de Aldeia dos Chãos em testes | Notícia | Migrado | `/noticias/repetidor-vhf-aldeia-dos-chaos-em-testes/` |
| `/site/2019/04/04/dia-nacional-sota/` | Divulgação: Dia Nacional SOTA | Evento | Migrado | `/eventos/dia-nacional-sota-2019/` |
| `/site/2019/04/09/dia-mundial-do-radioamador/` | Dia Mundial do Radioamador | Notícia | Migrado | `/noticias/dia-mundial-do-radioamador-2019/` |
| `/site/2019/05/17/instalacoes-arrabida/` | Instalações na Serra da Arrábida | Notícia | Migrado | `/noticias/instalacoes-na-serra-da-arrabida/` |
| `/site/2019/07/07/comunicado-1-banda-dos-144-146-mhz-wrc23/` | Comunicado #1 \| Banda dos 144-146 MHz \| WRC23 | Notícia | Migrado | `/noticias/comunicado-1-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/09/comunicado-2-banda-dos-144-146-mhz-wrc23/` | Comunicado #2 \| Banda dos 144-146 MHz \| WRC23 | Notícia | Migrado | `/noticias/comunicado-2-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/12/comunicado-3-banda-dos-144-146-mhz-wrc23/` | Comunicado #3 \| Banda dos 144-146 MHz \| WRC23 | Notícia | Migrado | `/noticias/comunicado-3-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/13/comunicado-4-banda-dos-144-146-mhz-wrc23/` | Comunicado #4 \| Banda dos 144-146 MHz \| WRC23 | Notícia | Migrado | `/noticias/comunicado-4-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/13/repetidor-dmr-cq0dla/` | Repetidor DMR CQ0DLA | Notícia | Migrado | `/noticias/repetidor-dmr-cq0dla/` |
| `/site/2019/07/14/comunicado-5-banda-dos-144-146-mhz-wrc23/` | Comunicado #5 \| Banda dos 144-146 MHz \| WRC23 | Notícia | Migrado | `/noticias/comunicado-5-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/15/comunicado-6-banda-dos-144-146-mhz-wrc23/` | Comunicado #6 \| Banda dos 144-146 MHz \| WRC23 | Notícia | Migrado | `/noticias/comunicado-6-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/29/1o-qso-ct-ea8-2-3-ghz-tropo/` | 1.º QSO CT – EA8 em 2.3 GHz tropo, QRB 1062 km | Artigo técnico | Migrado | `/tecnica/primeiro-qso-ct-ea8-2-3-ghz-tropo/` |
| `/site/2019/08/26/comunicado-7-banda-dos-144-146-mhz-wrc23/` | Comunicado #7 \| Banda dos 144-146 MHz \| WRC23 | Notícia | Migrado | `/noticias/comunicado-7-banda-144-146-mhz-wrc23/` |
| `/site/2019/08/28/comunicado-8-banda-dos-144-146-mhz-wrc23/` | Comunicado #8 \| Banda dos 144-146 MHz \| WRC23 | Notícia | Migrado | `/noticias/comunicado-8-banda-144-146-mhz-wrc23/` |
| `/site/2019/08/30/reuniao-cept-cpg/` | Reunião do Grupo Preparatório para a Conferência da CEPT | Notícia | Migrado | `/noticias/reuniao-grupo-preparatorio-cept/` |
| `/site/2019/09/09/repetidor-de-dmr-cq0dla/` | Repetidor de DMR CQ0DLA | Notícia | Migrado | `/noticias/repetidor-dmr-cq0dla-2019-09/` |
| `/site/2019/10/21/9-a-edicao-do-dia-nacional-de-amplitude-modulada-em-onda-curta-e-vhf/` | 9.ª Edição do Dia Nacional de Amplitude Modulada em Onda Curta e VHF | Evento | Migrado | `/eventos/9a-edicao-fim-de-semana-am/` |
| `/site/2019/10/28/comunicado-nova-legislacao-para-o-servico-de-amador/` | Comunicado #1 \| Nova legislação para o serviço de amador | Notícia | Migrado | `/noticias/comunicado-1-nova-legislacao-servico-de-amador/` |
| `/site/2019/12/31/utilizacao-da-faixa-1850-2000-khz-pelo-servico-de-amador-em-2020/` | Utilização da faixa 1850-2000 kHz pelo serviço de amador em 2020 | Notícia | Migrado | `/noticias/faixa-1850-2000-khz-em-2020/` |
| `/site/2020/02/13/comunicado-2-nova-legislacao-para-o-servico-de-amador/` | Comunicado #2 \| Nova legislação para o serviço de amador | Notícia | Migrado | `/noticias/comunicado-2-nova-legislacao-servico-de-amador/` |
| `/site/2020/02/25/comunicado-3-nova-legislacao-para-o-servico-de-amador/` | Comunicado #3 \| Nova legislação para o serviço de amador | Notícia | Migrado | `/noticias/comunicado-3-nova-legislacao-servico-de-amador/` |
| `/site/2020/02/27/comunicado-4-nova-legislacao-para-o-servico-de-amador/` | Comunicado #4 \| Nova legislação para o serviço de amador | Notícia | Migrado | `/noticias/comunicado-4-nova-legislacao-servico-de-amador/` |
| `/site/2020/03/05/comunicado-5-nova-legislacao-para-o-servico-de-amador/` | Comunicado #5 \| Nova legislação para o serviço de amador | Notícia | Migrado | `/noticias/comunicado-5-nova-legislacao-servico-de-amador/` |
| `/site/2020/04/17/dia-mundial-do-radioamador-2/` | Dia Mundial do Radioamador | Notícia | Migrado | `/noticias/dia-mundial-do-radioamador-2020/` |
| `/site/2020/09/23/comunicado-6-nova-legislacao-para-o-servico-de-amador/` | Comunicado #6 \| Nova legislação para o serviço de amador | Notícia | Migrado | `/noticias/comunicado-6-nova-legislacao-servico-de-amador/` |
| `/site/2021/03/11/weak-signals-micromeet-2021/` | Weak Signals – Sinais Fracos – Micromeet 2021 | Artigo técnico | Migrado | `/tecnica/weak-signals-micromeet-2021-parte-1/` |
| `/site/2021/03/14/ct1fbf-silent-key-2/` | Alguém especial… para refletir. | Notícia | Migrado | `/noticias/alguem-especial-para-refletir/` |
| `/site/2021/03/14/ct1fbf-silent-key/` | João Costa, CT1FBF, Silent Key | Notícia | Migrado | `/noticias/joao-costa-ct1fbf-silent-key/` |
| `/site/2021/04/27/weak-signals-micromeet-2021-2/` | Weak Signals – Sinais Fracos – Micromeet 2021 | Artigo técnico | Migrado | `/tecnica/weak-signals-micromeet-2021-parte-2/` |
| `/site/2021/10/19/10a-edicao-fim-de-semana-am/` | 10.ª Edição do Fim de Semana Nacional de Amplitude Modulada em Onda Curta e VHF | Evento | Migrado | `/eventos/10a-edicao-fim-de-semana-am/` |
| `/site/2021/11/23/rep-arla-workshop-antenas/` | REP-ARLA: Workshop prático de construção de antenas por Luís Valadas – CT1DTE | Evento | Migrado | `/eventos/workshop-construcao-de-antenas-2021/` |
| `/site/2022/01/03/anacom-anteprojeto-de-alteracao-radioamadorismo/` | ANACOM entrega ao Governo anteprojeto de alteração das regras do radioamadorismo com o objetivo de contribuir para o respetivo desenvolvimento | Notícia | Migrado | `/noticias/anacom-anteprojeto-alteracao-radioamadorismo/` |
| `/site/2022/07/01/arla-rep-workshop-sstv/` | ARLA-REP: Workshop SSTV por Miguel Andrade – CT1ETL | Evento | Migrado | `/eventos/workshop-sstv-2022/` |
| `/site/2022/08/02/testes-de-recepcao-nos-47-ghz/` | Testes de recepção nos 47 GHz | Artigo técnico | Migrado | `/tecnica/testes-de-rececao-nos-47-ghz/` |
| `/site/2022/10/10/11a-edicao-fim-de-semana-am/` | 11.ª Edição do Fim de Semana Nacional de Amplitude Modulada em Onda Curta e VHF | Evento | Migrado | `/eventos/11a-edicao-fim-de-semana-am/` |
| `/site/2023/03/15/estacao-de-rececao-ais/` | Estação de receção AIS ShipXplorer em Aldeia dos Chãos | Notícia | Migrado | `/noticias/estacao-de-rececao-ais-shipxplorer/` |
| `/site/2023/06/22/80x80-uma-nova-atividade-sstv/` | 80X80 uma nova atividade SSTV | Evento | Migrado | `/eventos/80x80-atividade-sstv/` |
| `/site/2023/11/16/modos-digitais-qo-100-ct1etl/` | O Potencial quase desconhecido de alguns modos digitais para as radiocomunicações através do satélite QO-100 | Artigo técnico | Migrado | `/tecnica/modos-digitais-para-o-qo-100/` |
| `/site/2024/04/14/convivio-pota-2024/` | Convívio POTA ARLA – 11 de Maio de 2024 | Evento | Migrado | `/eventos/convivio-pota-2024/` |
| `/site/2024/10/25/12a-edicao-fim-de-semana-am/` | 12.ª Edição do Fim de Semana Nacional de Amplitude Modulada em Onda Curta e VHF | Evento | Migrado | `/eventos/12a-edicao-fim-de-semana-am/` |
| `/site/estacao-portatil-qo-100/` | Estação portátil para o QO-100 | Artigo técnico | Migrado | `/tecnica/qo-100-estacao-portatil/` |
| `/site/qo-100_1/` | Como receber o QO-100 | Artigo técnico | Migrado | `/tecnica/qo-100-como-receber/` |
| `/site/satelite-qo-100-2/` | KG-STV no QO-100 | Artigo técnico | Migrado | `/tecnica/qo-100-kg-stv/` |
---

## Problemas encontrados no sítio anterior, e o que se fez

1. **Imagens partidas.** 176 referências apontavam para `arla.org.pt`, domínio que já não
   resolve. Os mesmos ficheiros existiam em `cs5arla.pt` com caminhos idênticos: a migração
   reescreveu todos os endereços e descarregou as imagens. **Artigos que hoje aparecem sem
   imagens passam a mostrá-las.**
2. **Uma imagem apontava para `cs5arla.com`** (domínio errado no original) — recuperada em
   `cs5arla.pt`.
3. **Categorias sem utilidade.** 58 de 61 artigos em «geral». Substituídas por categorias
   com significado e por três tipos de conteúdo distintos.
4. **Página CS5ARLA vazia.** Continha apenas o título «EUC CS5ARLA». Reconstruída com o que
   é verificável, e assinalada como incompleta.
5. **Painéis da Rice University sem resposta** na página de meteorologia espacial. Mantidos
   os do HamQSL e do NOAA, que respondem.
6. **Historial termina em 2012**, com a marca «(conteúdo em atualização)» no original. Essa
   marca foi preservada e é mostrada como aviso no fim da linha do tempo.
7. **Erro de data num artigo de 2017** («Sábado, dia 5 e Agosto de 2016»). Preservado tal
   como publicado e registado em [carece-de-verificacao.md](carece-de-verificacao.md) —
   corrigi-lo em silêncio seria alterar o registo histórico.
