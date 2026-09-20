# Mapa de redireções

Todas as moradas do sítio WordPress anterior continuam a funcionar.

São **96 correspondências de endereço**, quase todas geradas em duas variantes — com e sem
o prefixo `/site/`, para o caso de o sítio novo passar a ser servido na raiz do domínio.
Três delas (`/site/`, `/site/contactos/` e `/site/noticias/`) só existem com o prefixo,
porque a variante sem prefixo é uma página do sítio novo.

Os números exatos, verificáveis nos ficheiros:

| Ficheiro | Regras | Composição |
| --- | --- | --- |
| `src/lib/redirects.mjs` | **183** | 93 endereços de rota, 90 deles em duas variantes |
| `public/.htaccess` | **190** | as 183 acima + 6 para ficheiros PDF + 1 regra final de recolha (`^site/?$`) |
| `public/_redirects` | **190** | as 183 acima + 6 para ficheiros PDF + 1 regra de recolha (`/site/*`) |

As redireções 301 preservam a autoridade de pesquisa acumulada e garantem que nenhuma
ligação partilhada ao longo dos anos — em fóruns, mensagens ou marcadores — deixa de
funcionar.

As tabelas abaixo listam as 96 correspondências canónicas.

## Como estão implementadas

As redireções existem em três formatos, para que funcionem em qualquer alojamento. Os três
ficheiros são mantidos à mão e descrevem o mesmo mapa — `src/lib/redirects.mjs` é a
referência, mas **não gera** os outros dois:

| Ficheiro | Para que servidor | O que faz |
| --- | --- | --- |
| `public/.htaccess` | Apache (o mais provável no alojamento atual) | 301 reais, ao nível do servidor, mais cabeçalhos de segurança e de cache |
| `public/_redirects` | Netlify, Cloudflare Pages | 301 reais |
| `src/lib/redirects.mjs` → `astro.config.mjs` | Qualquer alojamento de ficheiros estáticos | Páginas de redireção com `meta refresh` e `<link rel="canonical">`, como rede de segurança |

Os ficheiros `.pdf` só são redirecionados ao nível do servidor: gerar uma página HTML
num caminho terminado em `.pdf` confundiria quem o descarregasse. A regra final de recolha
(qualquer outro endereço sob `/site/` vai para a página inicial) também só existe ao nível
do servidor.

**Os três ficheiros são mantidos à mão e têm de ser alterados em conjunto.** Não há
geração automática: acrescentar uma redireção só em `src/lib/redirects.mjs` deixa-a a
funcionar por `meta refresh` mas sem 301 real no alojamento atual.

## Verificação

```bash
npm run build
npm run lint:links            # confirma que nenhum destino está partido
```

A última verificação não encontrou ligações internas partidas.

---

## Páginas institucionais

10 redireções.

| URL antigo | → | URL novo |
| --- | --- | --- |
| `/site/` | → | `/` |
| `/site/associacao/` | → | `/arla/` |
| `/site/aviso-legal/` | → | `/legal/aviso-legal/` |
| `/site/contactos/` | → | `/contactos/` |
| `/site/direcao-tecnica/` | → | `/arla/direcao-tecnica/` |
| `/site/historial/` | → | `/arla/historia/` |
| `/site/orgaos-sociais/` | → | `/arla/orgaos-sociais/` |
| `/site/quem-somos/` | → | `/arla/quem-somos/` |
| `/site/quotizacao/` | → | `/arla/quotizacao/` |
| `/site/ser-associado/` | → | `/arla/ser-associado/` |

## Rede — repetidores e balizas

4 redireções.

| URL antigo | → | URL novo |
| --- | --- | --- |
| `/site/associacao/repetidores/` | → | `/rede/repetidores/` |
| `/site/balizas/` | → | `/rede/balizas/` |
| `/site/euc-cs5arla/` | → | `/rede/cs5arla/` |
| `/site/repetidores/` | → | `/rede/repetidores/` |

## Radioamadorismo e conteúdos técnicos

6 redireções.

| URL antigo | → | URL novo |
| --- | --- | --- |
| `/site/estacao-portatil-qo-100/` | → | `/tecnica/qo-100-estacao-portatil/` |
| `/site/indices-propagacao/` | → | `/radioamadorismo/meteorologia-espacial/` |
| `/site/qo-100_1/` | → | `/tecnica/qo-100-como-receber/` |
| `/site/radioamador/` | → | `/radioamadorismo/ser-radioamador/` |
| `/site/radioamadorismo-o-que-e/` | → | `/radioamadorismo/o-que-e/` |
| `/site/satelite-qo-100-2/` | → | `/tecnica/qo-100-kg-stv/` |

## Listagens, categorias e paginação

5 redireções.

| URL antigo | → | URL novo |
| --- | --- | --- |
| `/site/category/actividades/` | → | `/noticias/categoria/atividades/` |
| `/site/category/geral/` | → | `/noticias/` |
| `/site/category/sstv/` | → | `/eventos/` |
| `/site/feed/` | → | `/rss.xml` |
| `/site/noticias/` | → | `/noticias/` |

## Páginas de conta do WordPress

7 redireções.

| URL antigo | → | URL novo |
| --- | --- | --- |
| `/site/account/` | → | `/area-reservada/` |
| `/site/login/` | → | `/area-reservada/` |
| `/site/logout/` | → | `/area-reservada/` |
| `/site/members/` | → | `/area-reservada/` |
| `/site/password-reset/` | → | `/area-reservada/` |
| `/site/register/` | → | `/area-reservada/` |
| `/site/user/` | → | `/area-reservada/` |

## Ficheiros

3 redireções.

| URL antigo | → | URL novo |
| --- | --- | --- |
| `/site/ARLA_ficha_de_inscrição.pdf` | → | `/documentos/arla-ficha-de-inscricao.pdf` |
| `/site/estatutos_arla.pdf` | → | `/documentos/estatutos-arla.pdf` |
| `/site/regulamentos_internos.pdf` | → | `/documentos/regulamentos-internos.pdf` |

## Artigos (por data de publicação)

61 redireções.

| URL antigo | → | URL novo |
| --- | --- | --- |
| `/site/2017/07/11/emissoes-em-sstv-08072017/` | → | `/eventos/emissoes-sstv-2017-07-08/` |
| `/site/2017/08/04/5-o-ciclo-raid/` | → | `/noticias/5-ciclo-raid/` |
| `/site/2017/08/09/emissoes-em-sstv-sabado-1282017/` | → | `/eventos/emissoes-sstv-2017-08-12/` |
| `/site/2017/10/06/emissoes-em-dsstv-msk-e-4lfsk-via-cq0varb-sabado-07102017/` | → | `/eventos/emissoes-dsstv-2017-10-07/` |
| `/site/2017/10/16/jamboree-cs5asa-agrupamento-581-cne/` | → | `/eventos/jamboree-no-ar-2017-cs5asa/` |
| `/site/2017/10/23/7a-edicao-do-dia-da-amplitude-modulada/` | → | `/eventos/7a-edicao-fim-de-semana-am/` |
| `/site/2017/11/03/neamwave17/` | → | `/noticias/exercicio-neamwave17/` |
| `/site/2017/11/10/sstv-11-nov-arrabida-1457375-mhz/` | → | `/eventos/emissoes-sstv-2017-11-11/` |
| `/site/2017/11/23/participacao-na-feira-arvm/` | → | `/noticias/participacao-feira-radio-arvm-2017/` |
| `/site/2017/12/20/boas-festas-2017/` | → | `/noticias/boas-festas-2017/` |
| `/site/2018/05/08/torre-aldeia-dos-chaos/` | → | `/noticias/torre-aldeia-dos-chaos/` |
| `/site/2018/05/16/regulamento-geral-de-proteccao-de-dados/` | → | `/noticias/regulamento-geral-de-protecao-de-dados/` |
| `/site/2018/05/21/demolicao-da-torre-santiago-do-cacem/` | → | `/noticias/demolicao-da-torre-em-aldeia-dos-chaos/` |
| `/site/2018/05/23/noite-digital-psk-ros-vhf/` | → | `/eventos/noite-digital-psk-ros-vhf-2018/` |
| `/site/2018/08/18/instalacoes-em-aldeia-dos-chaos/` | → | `/noticias/instalacoes-em-aldeia-dos-chaos-2018-08/` |
| `/site/2018/08/30/instalacoes-em-aldeia-dos-chaos-2/` | → | `/noticias/instalacoes-em-aldeia-dos-chaos-2018-08-30/` |
| `/site/2018/10/14/instalacoes-em-aldeia-dos-chaos-3/` | → | `/noticias/instalacoes-em-aldeia-dos-chaos-2018-10/` |
| `/site/2018/12/19/boas-festas-2018/` | → | `/noticias/boas-festas-2018/` |
| `/site/2019/01/27/instalacoes-em-aldeia-dos-chaos-4/` | → | `/noticias/instalacoes-em-aldeia-dos-chaos-2019-01/` |
| `/site/2019/03/19/actividade-dmr-em-simplex/` | → | `/eventos/atividade-dmr-em-simplex-2019/` |
| `/site/2019/03/19/encontro-dmr/` | → | `/noticias/almoco-convivio-voz-digital/` |
| `/site/2019/03/21/repetidor-de-vhf-de-aldeia-dos-chaos-em-testes/` | → | `/noticias/repetidor-vhf-aldeia-dos-chaos-em-testes/` |
| `/site/2019/04/04/dia-nacional-sota/` | → | `/eventos/dia-nacional-sota-2019/` |
| `/site/2019/04/09/dia-mundial-do-radioamador/` | → | `/noticias/dia-mundial-do-radioamador-2019/` |
| `/site/2019/05/17/instalacoes-arrabida/` | → | `/noticias/instalacoes-na-serra-da-arrabida/` |
| `/site/2019/07/07/comunicado-1-banda-dos-144-146-mhz-wrc23/` | → | `/noticias/comunicado-1-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/09/comunicado-2-banda-dos-144-146-mhz-wrc23/` | → | `/noticias/comunicado-2-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/12/comunicado-3-banda-dos-144-146-mhz-wrc23/` | → | `/noticias/comunicado-3-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/13/comunicado-4-banda-dos-144-146-mhz-wrc23/` | → | `/noticias/comunicado-4-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/13/repetidor-dmr-cq0dla/` | → | `/noticias/repetidor-dmr-cq0dla/` |
| `/site/2019/07/14/comunicado-5-banda-dos-144-146-mhz-wrc23/` | → | `/noticias/comunicado-5-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/15/comunicado-6-banda-dos-144-146-mhz-wrc23/` | → | `/noticias/comunicado-6-banda-144-146-mhz-wrc23/` |
| `/site/2019/07/29/1o-qso-ct-ea8-2-3-ghz-tropo/` | → | `/tecnica/primeiro-qso-ct-ea8-2-3-ghz-tropo/` |
| `/site/2019/08/26/comunicado-7-banda-dos-144-146-mhz-wrc23/` | → | `/noticias/comunicado-7-banda-144-146-mhz-wrc23/` |
| `/site/2019/08/28/comunicado-8-banda-dos-144-146-mhz-wrc23/` | → | `/noticias/comunicado-8-banda-144-146-mhz-wrc23/` |
| `/site/2019/08/30/reuniao-cept-cpg/` | → | `/noticias/reuniao-grupo-preparatorio-cept/` |
| `/site/2019/09/09/repetidor-de-dmr-cq0dla/` | → | `/noticias/repetidor-dmr-cq0dla-2019-09/` |
| `/site/2019/10/21/9-a-edicao-do-dia-nacional-de-amplitude-modulada-em-onda-curta-e-vhf/` | → | `/eventos/9a-edicao-fim-de-semana-am/` |
| `/site/2019/10/28/comunicado-nova-legislacao-para-o-servico-de-amador/` | → | `/noticias/comunicado-1-nova-legislacao-servico-de-amador/` |
| `/site/2019/12/31/utilizacao-da-faixa-1850-2000-khz-pelo-servico-de-amador-em-2020/` | → | `/noticias/faixa-1850-2000-khz-em-2020/` |
| `/site/2020/02/13/comunicado-2-nova-legislacao-para-o-servico-de-amador/` | → | `/noticias/comunicado-2-nova-legislacao-servico-de-amador/` |
| `/site/2020/02/25/comunicado-3-nova-legislacao-para-o-servico-de-amador/` | → | `/noticias/comunicado-3-nova-legislacao-servico-de-amador/` |
| `/site/2020/02/27/comunicado-4-nova-legislacao-para-o-servico-de-amador/` | → | `/noticias/comunicado-4-nova-legislacao-servico-de-amador/` |
| `/site/2020/03/05/comunicado-5-nova-legislacao-para-o-servico-de-amador/` | → | `/noticias/comunicado-5-nova-legislacao-servico-de-amador/` |
| `/site/2020/04/17/dia-mundial-do-radioamador-2/` | → | `/noticias/dia-mundial-do-radioamador-2020/` |
| `/site/2020/09/23/comunicado-6-nova-legislacao-para-o-servico-de-amador/` | → | `/noticias/comunicado-6-nova-legislacao-servico-de-amador/` |
| `/site/2021/03/11/weak-signals-micromeet-2021/` | → | `/tecnica/weak-signals-micromeet-2021-parte-1/` |
| `/site/2021/03/14/ct1fbf-silent-key-2/` | → | `/noticias/alguem-especial-para-refletir/` |
| `/site/2021/03/14/ct1fbf-silent-key/` | → | `/noticias/joao-costa-ct1fbf-silent-key/` |
| `/site/2021/04/27/weak-signals-micromeet-2021-2/` | → | `/tecnica/weak-signals-micromeet-2021-parte-2/` |
| `/site/2021/10/19/10a-edicao-fim-de-semana-am/` | → | `/eventos/10a-edicao-fim-de-semana-am/` |
| `/site/2021/11/23/rep-arla-workshop-antenas/` | → | `/eventos/workshop-construcao-de-antenas-2021/` |
| `/site/2022/01/03/anacom-anteprojeto-de-alteracao-radioamadorismo/` | → | `/noticias/anacom-anteprojeto-alteracao-radioamadorismo/` |
| `/site/2022/07/01/arla-rep-workshop-sstv/` | → | `/eventos/workshop-sstv-2022/` |
| `/site/2022/08/02/testes-de-recepcao-nos-47-ghz/` | → | `/tecnica/testes-de-rececao-nos-47-ghz/` |
| `/site/2022/10/10/11a-edicao-fim-de-semana-am/` | → | `/eventos/11a-edicao-fim-de-semana-am/` |
| `/site/2023/03/15/estacao-de-rececao-ais/` | → | `/noticias/estacao-de-rececao-ais-shipxplorer/` |
| `/site/2023/06/22/80x80-uma-nova-atividade-sstv/` | → | `/eventos/80x80-atividade-sstv/` |
| `/site/2023/11/16/modos-digitais-qo-100-ct1etl/` | → | `/tecnica/modos-digitais-para-o-qo-100/` |
| `/site/2024/04/14/convivio-pota-2024/` | → | `/eventos/convivio-pota-2024/` |
| `/site/2024/10/25/12a-edicao-fim-de-semana-am/` | → | `/eventos/12a-edicao-fim-de-semana-am/` |

## Regra de recolha

Além das redireções explícitas, o `.htaccess` inclui uma regra final que envia qualquer
pedido restante a `/site/` para a página inicial, e a página 404 explica a quem chegar de
uma ligação antiga o que aconteceu, com pesquisa e atalhos.
