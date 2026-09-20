---
titulo: "O Potencial quase desconhecido de alguns modos digitais para as radiocomunicações através do satélite QO-100"
resumo: "Vários são os parâmetros que podem ser escolhidos para uma eventual estimativa de eficácia, ou mesmo comparação, entre modos (protocolos) digitais em radiocomunicações, ainda que existam…"
data: "2023-11-16"
atualizado: "2024-09-08"
categoria: "Satélites"
etiquetas:
  - "QO-100"
  - "Modos digitais"
  - "Satélites"
  - "SSTV"
  - "DATV"
historico: false
destaque: true
urlAntigo: "/site/2023/11/16/modos-digitais-qo-100-ct1etl/"
nivel: "avancado"
indice: true
autor: "Miguel Andrade"
indicativo: "CT1ETL"
---

por Miguel Andrade, CT1ETL

## Introdução

Vários são os parâmetros que podem ser escolhidos para uma eventual estimativa de eficácia, ou mesmo comparação, entre modos (protocolos) digitais em radiocomunicações, ainda que existam especificidades não comparáveis, uma vez que muitos deles foram concebidos para condições de propagação, atenuação ou absorção dos sinais e faixas de frequências específicas.

Os critérios mais comuns ou termos de comparação estão relacionados com a existência ou não de um sistema correção de erros, com a taxa de transmissão de dados (ou velocidade de escrita), com a tolerância às interferências, com a eficiência (entenda-se neste contexto a largura de banda utilizada e a gestão da energia), com o grau de facilidade ou dificuldade de operação (incluindo a disponibilidade e adaptabilidade a vários sistemas operativos informáticos e equipamentos diferentes) e, por fim, com o respetivo desempenho em condições desfavoráveis.

O grande mote para a evolução dos modos digitais de radiocomunicações no Serviço de Amador e Serviço de Amador por Satélite foi o de permitir comunicações com crescente eficácia, particularmente em condições adversas, tentando-se transpor os limites no longo e duro combate contra o ruído, a interferência, as condições efémeras de propagação ou em que os sinais se apresentam débeis.

Há escassas décadas (e durante muito mais de meio século), a telegrafia era recordista em termos de alcance e sobretudo considerada o mais eficaz modo de radiocomunicações, tendo em conta a gestão energética e o alcance.

Esta perceção durou tanto tempo que se chegou a acreditar que a telegrafia seria insuperável.

Para se avaliar o desempenho da telegrafia por tudo ou nada, teremos sempre que ter em consideração o ouvido humano e esse é um fator individual. Há entre nós quem só descodifique a mensagem com sinais de até 4 dB de relação sinal-ruído para uma largura de banda de 2500 Hz e uns raros privilegiados que conseguem descodificar sinais telegráficos com valores na ordem de -3 dB ou mesmo -4 dB, certamente que só ao alcance de alguns superdotados, com se verá mais adiante.

O modo Hellschreiber, descodificado por máquina, terminou com a aleatoriedade e a dependência da performance individual do nosso ouvido na descodificação.

Com o advento do modo RTTY, um sistema bitonal, ainda que tenha sido consideravelmente ultrapassada a performance da telegrafia com descodificação plena com níveis de relação sinal-ruído compreendidos entre 3 dB e -6 dB para a mesma largura de banda de 2500 Hz, caso o sinal não se revele suficientemente limpo, o número de erros aumenta proporcionalmente à degradação das condições, podendo a mensagem perder algumas letras, ir fazendo menos sentido (consoante o aumento dos carateres não descodificados), até se tornar totalmente ilegível.

O modo PSK (onde se inclui igualmente o BPSK, o QPSK e o 8PSK), introduzido pelo colega radioamador Peter Martinez (G3PLX), ainda que ligeiramente mais “lento” (31.25 baud para o PSK-31 e 45.45 baud para o RTTY 455), proporcionou um ganho de 6 dB na relação sinal-ruído, ou seja, passou a ser descodificável até um valor de -12 dB, usando-se sempre como referência os 2500 Hz de largura de banda.

Seguiram-se algumas melhorias com os modos Olivia, Contestia, MFSK, DominoEX, MT63, Thor, entre outros, mas não exatamente por esta ordem. Quase todos estes sucessivos modos de radiocomunicações digitais viriam a especializar-se nas condições específicas que se registam em determinadas faixas de frequências ou tipologias da propagação dos sinais eletromagnéticos.

Atribui-se ao modo ROS um limite inferior de legibilidade a níveis da relação sinal-ruído de -16 dB (ROS-16), -19 dB (ROS-8) e -22 dB (ROS-4) a 2500 Hz de largura de banda, o que classifica esta forma de comunicação com teclado entre uma das que apresentam melhores desempenho.

Para termos um ponto de comparação convém referir que se atribui à compreensibilidade de uma emissão em telefonia modulada em amplitude um limite inferior de +20 dB a +18 dB de relação sinal-ruído e à telefonia em banda lateral única entre +10 dB e +5 dB, sempre para uma largura de banda de 2500 Hz… com a aleatoriedade própria do ouvido humano e da inerente capacidade individual.

Os ensaios descritos em seguida focaram-se principalmente na análise de desempenho de vários modos digitais, desenhados ou não para a finalidade das radiocomunicações testadas em condições desfavoráveis, mas somente de acordo com a respetiva capacidade de descodificação observada através de uma deliberada simulação de sinais débeis através do transpositor de banda estreita do satélite geoestacionário QO-100.

Exceto nalgumas raras experimentações, como a descrita seguidamente neste artigo, ou outros exemplos de radiocomunicações com escassa e residual representatividade nas estatísticas disponíveis à data da elaboração deste artigo, a mais importante alternativa tanto à telegrafia como à telefonia que se tem registado no referido satélite foi, notória e destacadamente, o modo digital de comunicação simplificada (por se reger através de sequenciamento automático) denominado FT8, em particular no período compreendido entre fevereiro de 2019 e junho de 2023, esta última a data de início dos testes.

Segundo dados disponibilizados pelo QO-100 Dx Club [1], muito provavelmente em parte baseados nos diários de estação submetidos pelos respetivos associados, no período compreendido entre agosto de 2022 e maio de 2023, a atividade em modos de radiocomunicações digitais através do transpositor de banda estreita suplantou, significativamente, a registada pela telefonia em banda lateral única, aquela que é reconhecida como forma de radiocomunicações mais comum em toda a atividade do transpositor de banda estreita do primeiro satélite geoestacionário da história da humanidade acessível ao Serviço de Amador.

Ainda segundo a mesma fonte, na atividade registada durante a semana anterior à da realização das experiências relatadas neste artigo, foram assinalados 187 indicativos de estação diferentes, situadas, por sua vez, em 118 quadrículas distintas.

Relembra-se, a propósito, que não nos estamos a referir à atividade típica numa faixa de frequência de Ondas Curtas (HF), na qual estes mesmos resultados poderiam corresponder até ao nível de atividade diária, mas sim de radiocomunicações via satélite através das bandas S e X, isto é, com a respetiva ligação ascendente (do segmento de terra para o espaço) a ter lugar em 2400 MHz e ligação descendente (do espaço para o segmento de terra) a ocorrer em 10489 MHz.

Ignorando a controvérsia em que o modo FT8 tem estado envolto, com destaque para alguns apaixonados debates de ideias, ainda prevalece na opinião de muitos dos seus opositores o epífito de autómato – numa apreciação infundamentada por parte desses antagonistas – afirmando-se que podem ter lugar centenas de contactos com outras estações sem a necessária presença de um rádio operador a comandar a estação. Tal não corresponde, de todo, à realidade… pelo menos sem a intervenção de um outro programa informático criado para esse efeito ou de uma aplicação específica da inteligência artificial com esse objetivo.

À margem de quaisquer polémicas o que é assinalável neste modo é a respetiva capacidade para a descodificação integral de sinais débeis, sendo-lhe atribuído um limite de descodificação com a relação sinal ruído de -24 dB para uma largura e banda de 2500 Hz (entre -23 dB e -26 dB, variando de acordo com as fontes e as experiências relatadas)… regra geral consideravelmente inferior ao limite inferior de eficiência para a esmagadora maioria dos modos digitais de radiocomunicações comuns.

O colega Holger Kinzel, indicativo de estação DK8KW, curiosamente e apesar do sufixo da sua estação ser “KW”, escreveu, em 15-04-2019, num dos assuntos a debate no fórum da AMSAT-DL, que conseguiu receber e descodificar o seu próprio sinal no modo FT8 aplicando uma potência de emissão de 2 mili-watts através uma antena de refletor parabólico com 1 metro e 80 centímetros de diâmetro, o que terá, segundo os seus cálculos, resultado numa potência aparente radiada de 300 mW, tendo como referência uma antena isotrópica virtual (P.I.R.E. em língua Portuguesa ou E.I.R.P. em língua Inglesa).

No extremo oposto, se compararmos a referida potência de emissão com a da baliza inferior, ou seja, uma das referências para os limites máximos de sinal permitidos nas radiocomunicações que têm lugar através do satélite QO-100, estamos perante um valor incrivelmente ínfimo, uma vez que são atribuídos 950 Watts P.I.R.E. à referida baliza, o que equivale a multiplicar por quase 3170 vezes a potência de emissão calculada para a estação DK8KW na descrita experiência em FT8.

Valendo-nos igualmente da informação disponibilizada pelo sítio na internet do QO-100 Dx Club, podemos encontrar uma interessante ferramenta experimental denominada “Skimmer” [2], a qual acompanha permanentemente as emissões nos modos digitais de radiocomunicações simplificadas FT8 e FT4. Na semana anteriormente usada como referência, haviam-se registado sinais em FT8 descodificados plenitude com uma relação sinal ruído compreendida entre -21 dB e +26 dB, usando-se, como sempre, a referência a uma largura de banda de 2500 Hz.

Curiosamente, durante o mesmo período, ocorreram condições de propagação ou de ausência de atenuação excecionais numa das frequências das ligações ascendente ou descendente, as quais podem ter influenciado, em particular, o nível máximo dos valores positivos registados na supramencionada estatística.  
Possivelmente a popularidade dos modos FT8 e FT4 não se ficam a dever somente à respetiva eficácia, porém, constitui sempre um desafio interessante esclarecer se existiriam eventualmente outras alternativas comparáveis, ou quiçá até mais eficazes, em modos digitais de radiocomunicações escassamente ou nada utilizados nas radiocomunicações através do satélite QO-100.

Seria uma perda de recursos e de oportunidade não o tentar, nomeadamente caso não se aproveitassem as potencialidades oferecidas pelo transpositor de banda estreita conjuntamente com a regra da monitorização obrigatória das nossas próprias emissões.

A questão colocada não foi, de todo, apurar-se qual o melhor modo digital em radiocomunicações.

Como referido anteriormente (e nunca é demais repetir), cada modo foi projetado para um determinado conjunto de requisitos e aplicabilidade em situações muito específicas. Os protocolos e os decodificadores tentam otimizar a sensibilidade e a robustez nessas circunstâncias particulares de propagação dos sinais ou de comportamento espectável em relação a determinadas faixas de frequências, como a largura de banda passível de ser utilizada, por exemplo.

Os ensaios realizados tiveram como objetivo dar visibilidade a algumas potenciais opções que poderiam vir a enriquecer, com maior diversidade, as radiocomunicações QRP nas bandas S e X via satélite geoestacionário. Por outro lado, uma vez que nem todas as referidas alternativas estão classificadas na categoria de comunicação escrita, a utilização dessas novas opções permitiria cativar utilizadores entre alguns daqueles que são críticos em relação aos modos digitais de comunicação simplificada.

[1] <https://qo100dx.club/statistics>, consultado em 01-08-2023.  
[2] <https://qo100dx.club/skimmer-about>, consultado em 02-08-2023.

## A estação utilizada nesta experiência

A estação de radiocomunicações dedicada ao satélite QO-100 empregue neste ensaio possui dois circuitos independentes; um dedicado à emissão e um outro à receção, uma vez que não é constituída por um equipamento único de emissão e receção, isto é, um transcetor para as faixas de frequência dos 13 centímetros e dos 3 centímetros.

O circuito de receção foi contruído com base num recurso muito completo, de produção nacional e comercializada pela firma DX-Patrol, com a designação comercial “QO-100 DownConverter”.

Deste combinado de constituintes, destaca-se um conversor heteródino de baixo ruído com alimentador (captador) incorporado, igualmente conhecido como bloco de baixo ruído com conversor descendente de radiofrequência e antena recetora incorporados (LNBF), modelo EK-LBB21, o qual foi ligeiramente modificado e ao qual se emparelha um conversor descendente de radiofrequência, modelo “MK2Blue”, que, por sua vez, inclui uma fonte interna disciplinadora de frequência PLL, controlada por um oscilador de cristal com compensação de temperatura (TXCO), em 10 MHz (mas que permite igualmente receber sinal de uma fonte externa mais precisa como através de um oscilador disciplinado por sinal de GPS ou GPSDO), sem esquecer ainda um “T” de polarização destinado a alimentar com uma determinada tensão de corrente contínua o LNBF, através do próprio cabo coaxial, permitindo trocas de polarização das duas antenas incorporadas no captador do bloco de baixo ruído, através da alteração da voltagem fornecida.

O grande benefício desta escolha foi a conversão da frequência intermediária diretamente para uma de 4 faixas de frequência atribuídas ao Serviço de Amador proporcionadas pelo seletor de frequência de conversão, a saber, para a faixa dos 10 metros (28,550 MHz), dos 2 metros (144,550 MHz), dos 70 centímetros (432,550 MHz), ou ainda para a faixa dos 23 centímetros (1296,550 MHz), dispensando, desta forma, uma utilização obrigatória de um recetor dedicado para os 739 MHz, ou de um recetor definido e controlado por suporte lógico (SDR), o qual exigiria ainda um computador, telemóvel ou prancheta informática para o respetivo comando e controlo.

Foi, sem dúvida uma solução simples e adaptável, feita à medida do Serviço de Amador por Satélite.  
A ligação de todo este conjunto faz-se entre a saída do conversor descendente de radiofrequência e uma ficha de antena de um transcetor (ou recetor) disponível.

Nas ligações entre o conversor heteródino de baixo ruído com alimentador incorporado e o conversor descendente de radiofrequência foram utilizados cabos coaxiais de Ø 6.8 mm que apresentam uma impediência de 75 Ω, com revestimento exterior LSZH de cor branca, apresentando uma atenuação nominal por cada 100 metros como sendo de 4,7 dB a 50 MHz e até 33,9 dB a 3 GHz. As fichas de ligação do cabo coaxial, tanto nos terminais do LNBF, como nos terminais do conversor descendente de radiofrequência são do tipo “F” para cabo RG-6, do tipo de enroscar e com vedante.

A ligação entre conversor descendente de radiofrequência e o transcetor, foi assegurada por um cabo coaxial adaptador, modelo RG-316, de 15 centímetros de comprimento, provido de uma ficha do tipo SMA macho (para assegurar ligação ao conversor ascendente de radiofrequência) e uma ficha do tipo N macho, na extremidade oposta (para ligação à ficha de antena dedicada à faixa dos 23 centímetros no transcetor).

No caso em apreço foi utilizado um transcetor da marca Icom modelo IC-9700, muito popular em estações do Serviço de Amador por Satélite, nomeadamente por possuir duplo oscilador de frequência variável (VFO), permitindo dessa forma a emissão e receção simultâneas e autónomas, em faixas de frequências distintas.

A frequência final para receção na banda X (10 GHz) foi, dessa forma, a faixa dos 23 centímetros (1296 MHz) e controlada no VFO definido como secundário do supracitado transcetor.  
Na base do circuito de emissão esteve igualmente o mesmo equipamento (IC-9700), mas utilizando-se como emissor o remanescente VFO, definido como primário, para assegurar as transmissões em 432 MHz (faixa dos 70 centímetros).

A etapa seguinte do circuito independente dedicado à emissão consistiu num conversor ascendente de radiofrequência da marca DX Patrol, modelo “UpConverter MK4 for QO-100”, cujas principais características incluem uma referência de frequência interna através de um TCXO, em 10 MHz, que garante uma estabilidade de 500 ppb, ainda que possua igualmente a possibilidade de entrada de um sinal externo alternativo de outra fonte, como o anteriormente referido oscilador disciplinado por sinal de GPS (GPSDO), por exemplo.

Este dispositivo dispõe igualmente de quatro possibilidades pré-programadas para outras tantas alternativas em termos de frequência intermediária (nomeadamente na faixa dos 10 metros, dos 2 metros, dos 70 centímetros e dos 23 centímetros), apresentando um sinal razoavelmente limpo e estável. As emissões espúrias sofrem uma atenuação igual ou superior a 50 dB.

A potência de emissão é regulável, internamente, até ao limite de 200 mW (23 dBm), para uma excitação de radiofrequência compreendida entre 1 watt (30 dBm) e 3 watts (34,8 dBm), apresentado uma tolerância máxima absoluta em relação ao sinal de excitação de até 6 W (37,8 dBm).

A potência de emissão do conversor ascendente de radiofrequência foi alinhada para 150 mW para não esforçar demasiadamente o aparelho nas emissões de longa duração.

A ligação entre transcetor e o conversor ascendente de radiofrequência, foi assegurada por um cabo coaxial adaptador, modelo URM76, de 3 metros de comprimento, provido de uma ficha do tipo SMA macho (para assegurar ligação ao conversor descendente de radiofrequência) e uma ficha do tipo N macho, na extremidade oposta (para ligação à ficha de antena dedicada às faixas dos 70 centímetros no transcetor).

Como linha de transmissão entre o conversor ascendente de radiofrequência e o iluminador instalado no refletor paraboloide (antena descrita mais adiante), foi utilizado um cabo semirrígido de baixas perdas RG-402 de 1 metro de comprimento, apetrechado com duas fichas macho do tipo SMA em ambas as extremidades.

O cálculo rigoroso das perdas reais ocorridas nas linhas transmissão pode vir a constituir um valor relativamente difícil de obter, estando o mesmo dependente da composição do circuito, mas igualmente de questões ambientais influenciadoras das respetivas prestações.

De acordo com os dados publicitados em relação ao cabo RG-402, a atenuação verificada neste troço de cabo, em 3 GHz, situar-se-á em valores próximos de 0,5 dB.

Se atribuirmos às fichas de ligação um valor teórico de perdas na ordem de 2 dB (cada uma), podemos chegar a um valor hipotético de até 4,5 dB de perdas para esta linha de transmissão. Partindo desta estimativa, ainda que de forma grosseira e não asseverada através de medição instrumental, podemos antecipar que chegará à antena uma potência estimada de 53 mW, o que corresponde a uma perda de cerca de 64,5% da energia emitida pelo conversor ascendente de radiofrequência.

A frequência de trabalho tanto no conversor descendente de radiofrequência, como no conversor ascendente de radiofrequência, assim como no próprio transcetor, foi ajustada através de um oscilador disciplinado por sinal de GPS, modelo “GPSDO V2.0” igualmente produzido pela mesma firma dos restantes componentes.

## Descrição do sistema radiante em ambos os circuitos (RX e TX)

No circuito de receção dos sinais, para a banda X com frequências situadas no segmento compreendido entre os 10489,500 MHz e os 10490,000 MHz (transpositor de banda estreita do satélite QO-100), a estação dispõe de uma antena dedicada, constituída por um refletor paraboloide, geralmente descrito como medindo 60 centímetros de diâmetro, sendo, no entanto, as respetivas dimensões totais na de 608 mm x 533 mm, o que lhe confere uma aparência ligeiramente oblonga, característica comum no formato das antenas deste tipo alimentadas fora de centro.

No circuito de emissão dos sinais na banda S (2.4 GHz), a estação dispôs igualmente de um sistema radiante dedicado, similarmente composto por um refletor parabólico para iluminador fora de centro e exatamente das mesmas dimensões descritas previamente para o circuito de receção, ou seja, 608 mm x 533 mm.

Por ter sido a melhor seleção disponível, entre várias testadas, tanto no aspeto mecânico como no eletromagnético, o iluminador escolhido foi uma antena autoconstruída de banda dupla (S/X), batizada comercialmente, em março de 2018, como POTY (Patch Of The Year), a qual se baseia num desenho dos colegas Mike Willis (G0MJW), Remco den Besten (PA3FYM) e Paul Marsh (M0EYT). Esta mesma antena foi sendo proporcionada à comunidade através de conjunto de componentes separados para montagem (“kit”) da autoria do colega Hans Holsink (PE1CKK).

A parte especificamente destinada à emissão na banda S, deste modelo adaptado para dupla banda, foi concebida e inspirada no tipo original de antena de microfita, descrita por Howell em 1972.  
Trata-se na realidade de um desenho baseado na tipologia de antena do género “remendo”, conhecida comummente, mesmo na comunidade de língua portuguesa através da designação anglo-saxónica “patch antenna”, sendo algo popular nas duas faixas de frequência superiores de UHF e nas inferiores de SHF, no Serviço de Amador, pelo respetivo ganho e prestação.

Estamos essencialmente perante um ressoador aberto, constituído por um plano de terra sobreposto por um elemento que irradia as ondas eletromagnéticas, fazendo-se a separação entre ambos por um dielétrico não condutor, o qual, neste caso em particular, é simplesmente o ar.

A esta antena emissora foi acrescentada uma guia de onda calculada para as frequências da ligação descendente do satélite, sendo esta última destinada a acoplar-se um bloco de baixo ruído com alimentador incorporado (LNBF), o que permite fazer-se uso de um único suporte, tanto para o iluminador como para o alimentador, num mesmo refletor parabólico.

Vários testemunhos encontrados na internet atribuem à qualidade da montagem e seu correto alinhamento, assim como ao respeito rigoroso por certas medidas na própria montagem, como a separação entre os dois elementos (irradiante e plano de terra), ou até a distintas soluções de impermeabilização testadas (incluindo a ausência das mesmas), fatores a não negligenciar em relação ao comportamento espectável e ganho desta antena em 2.4 GHz, sem nunca esquecer, porém, que o próprio posicionamento da POTY em relação ao ponto focal de um refletor parabólico pode influenciar o respetivo digrama de radiação, a relação de ondas estacionárias e o ganho total do conjunto, pelo que cada instalação não profissional pode apresentar um comportamento específico.

À maioria das versões autoconstruídas a partir do conjunto fornecido para montagem da autoria do colega Hans Holsink (PE1CKK) e testadas por outros radioamadores, é-lhes atribuído um ganho compreendido entre 6 dBi e 9 dBi.

No caso em questão, a antena foi usada exclusivamente em transmissão, como iluminador, pelo que apenas a componente destinada à banda S foi utilizada, isto é, o plano de terra e o respetivo elemento irradiante, tendo sido reservada à guia de onda para a banda X unicamente a função de suporte para o posicionamento do conjunto o melhor possível em relação ao ponto focal (teórico).

Uma vez que o refletor (plano de terra) da própria antena “remendo” não permitiu, fisicamente, posicionar o iluminador no ponto considerado ideal para a focagem, nomeadamente caso se pretendesse respeitar as adequadas diretrizes fornecidas pelos promotores da antena POTY no respetivo posicionamento, pelo que, alguma eficiência acabou por vir a ser sacrificada, o que se tentou refletir, pelo menos em teoria, nos cálculos sobre o ganho total do conjunto.  
Como ganho, entenda-se a razão entre a potência irradiada no lóbulo principal produzido pela antena em relação à potência irradiada por uma antena de referência, a qual pode ser isotrópica (expressa em dBi) ou dipolar (expressa em dB).

Após aplicação de uma das fórmulas de estimativa do ganho de uma antena com refletor parabólico ao modelo real, ainda que sem o rigor equipolente a um cálculo de origem profissional, podemos atribuir, ao sistema irradiante utilizado nos ensaios aqui relatados, um valor aproximado de 19 dBi de ganho em 2.4 GHz, o que nos induz a acreditar que a energia irradiada será equivalente a 4,2 watts P.I.R.E.

Em termos práticos seria o equivalente a multiplicar os 53 mW que foram calculados no iluminador por 800, quando comparado com a potência em watts que teria que ser irradiada por uma antena teórica isotrópica para fornecer a mesma densidade de fluxo por metro quadrado.

Analogamente e em relação ao valor de 950 Watts P.I.R.E., considerados como o limite máximo das emissões aceites através do transpositor de banda estreita, a potência de emissão calculada para os ensaios descritos neste artigo foi 226 vezes inferior a esse limite, isto é, os resultados aqui relatados foram conseguidos com um valor de 4,4% da potência total necessária para se atingir o limite superior dos sinais admitidos para as radiocomunicações efetuadas através do transversor de banda estreita do satélite QO-100.

Na realidade, porém, não houve tempo para aferir se a antena emissora (iluminador) está a cumprir com a melhor eficácia o seu desempenho, isto é, se o padrão da irradiação está perfeitamente enquadrado com o refletor e se o ganho real de todo o sistema é efetivamente e na prática de 19 dBi, ainda que algumas fontes consultadas apresentem valores de cálculo na ordem de 20 dBi a 23 dBi para sistemas irradiantes equivalentes e equiparáveis, pelo que somente futuros testes, mais aprofundados, poderão vir a confirmar o real ganho obtido por este sistema irradiante.

## Informática

O computador que controlou todas as funções desta estação, desde o comando do transcetor à descodificação das emissões é da marca Hewlett-Packard, modelo “Notebook HP Pavillion Gamming 15-ec2007np”, com sistema operativo Windows 11 Home.

O programas informáticos utilizados foram o WSJT-X 2.6.1 para os modos FT8, FT4, JT9, JT65 e Q65, o ROS v7.4.0 para os modos ROS 4, ROS 8, ROS 16, o WSQ2 1.0 para o modo Weak Signal QSO e o FLdigi 4.2.0 para os restantes.

Com ligeiras nuances, foram criadas duas versões individualizadas na execução dos programas informáticos, isto é, duas cópias passíveis de serem executadas em simultâneo, mas com formatações suficientemente distintas para não serem reconhecidas como a mesma, pela máquina onde correram.

Estas execuções singulares (instâncias, numa tradução livre e direta do termo anglo-saxónico aplicável) de uma mesma aplicação informática, são geridas de forma independente, desde que sejam tomadas algumas precauções para que o sistema operativo e os próprios programas assim o consintam.

No caso em apreço não foi sequer necessário o recurso a um cabo de áudio virtual, uma vez que ambas as cópias executadas conjuntamente partilharam, sem conflitos, o mesmo sinal de áudio do VFO dedicado à receção, através do cabo físico que ligou o transcetor IC-9700 ao porto USB do computador.

## Metodologia

Na esfera do amadorismo não é fácil encontrarem-se fontes rigorosas que comparem os limites mínimos da sensibilidade ou a robustez dos vários modos digitais de radiocomunicações entre si, ou metodologias comprovadamente à prova de todas as eventuais variáveis.

Quase impossível deverá ser encontrar-se uma tabela já previamente construída que inclua a combinação de todos os modos testados nesta experiência, nomeadamente porque não se compara o que não é comparável.

Os dados disponíveis na internet que foram analisados não são totalmente coerentes, não só pela variedade dos instrumentos utilizados no respetivo apuramento, como pela diversidade nas metodologias adotadas.

Na busca por tal recurso foi, entretanto, localizada uma tabela que engloba a telefonia em banda lateral única, a telegrafia em código Morse e alguns modos digitais de radiocomunicações utilizados no Serviço de Amador e Serviço de Amador por Satélite, num excelente artigo da autoria do colega, Pieter-Tjerk de Boer, PA3FWM, publicado em 2015 e intitulado “Signal/noise ratio of digital amateur modes” [3].

Encontra-se ainda neste artigo a alusão ao facto dos profissionais utilizarem uma forma distinta para analisarem a eficiência de um modo de radiocomunicações sem ser através da nossa habitual comparação da relação sinal-ruído, na qual por vezes confrontamos a potência de um sinal de 6 Hz de largura de banda, como a emissão em WSPR, por exemplo, com a potência de ruído recebida num filtro com a amplitude total de 2500 Hz, uma vez que geralmente a receção nos ensaios é feita em banda lateral única.

A fórmula mais comum, particularmente em determinados meios profissionais é “Eb/N0”, sendo Eb a energia despendida por bit e N0 a potência do ruído numa largura de banda de 1 Hz.

Embora o denominador desta relação seja comparável ao que os amadores utilizam, ainda que com uma grandeza de 1 Hz em vez de 2500 Hz, a virtude, porém, encontra-se expressa no numerador, pois enquanto nós amadores tentamos inferir a potência recebida, os utilizadores da referida fórmula têm em consideração a energia recebida por bit.

A fórmula “Eb/N0”, per se, não será, porém, o formato de mensuração mais preciso e definitivo para este trabalho. Trata-se, na realidade, apenas de uma medida da eficiência em relação ao canal utilizado, assumindo que o mesmo apenas adiciona ruído branco puro ao sinal, quando, na prática, a maioria dos canais nas radiocomunicações apresentam outras formas de efeitos atenuadores e de degradação dos sinais, como ruído de impulso (sobretudo em frequências menos elevadas) ou variações na intensidade devido ao desvanecimento (mais preponderantes em Ondas Curtas) ou absorção e atenuação (mais preponderantes em frequências superiores).

Não se obtém uma resposta concreta sobre como é que, na versão simplificada da referida fórmula, estes fatores são tidos em consideração.

Na tabela publicada pelo autor, por exemplo, o valor atribuído aos modos PSK-31 e WSPR, de acordo com a fórmula “Eb/N0” é semelhante, mas enquanto uma breve variação no sinal da transmissão em PSK-31 causa imediatamente uma perda de descodificação de algumas letras, o modo WSPR revela-se bastante insensível a esse fenómeno, uma vez que toda a informação a ser transmitida está distribuída ao longo dos 2 minutos de emissão e não num momento específico em que é transmitido um determinado caracter.

Ainda assim, os modos digitais de radiocomunicações com períodos diferentes não podem ser comparados diretamente através da relação sinal-ruído na saída de áudio de um transcetor de banda lateral única, ou seja, numa largura de banda de 2500 Hz.  
A conversão entre as duas escalas é possível mediante as seguintes fórmulas:

SNR = Eb/N0 + 10 _log10(número de bits / período / largura de banda). Eb/N0 = SNR − 10_ log10(número de bits / período / largura de banda).

A nível profissional, os sistemas de radiocomunicação digitais de sinais débeis são geralmente avaliados pela relação da energia necessária por bit de informação (Eb) tendo em consideração a potência de ruído por Hz de largura de banda, incluindo a constante de Boltzmann kB e a temperatura de ruído equivalente T (N0 = kBT).

Em virtude do que ficou anteriormente expresso, deve ser prestada alguma atenção em relação aos resultados apresentados seguidamente.

Tal como referido no texto anterior, quando se menciona que um determinado modo digital de radiocomunicações no Serviço de Amador tem como limite mínimo previsível de descodificação dos sinais um valor de relação sinal-ruído de -23 dB, temos de ter em consideração que o mesmo possa ser, na realidade, na ordem de +7 dB.

O nível de ruído considerado residual de um sinal de 2,5 Hz de largura de banda recebido através de um recetor típico de banda lateral única com o filtro de 2500 Hz, é apurado através da seguinte fórmula:

10*Log(2500/2.5) = 30 dB.

A magnitude do nível ruído é, por essa razão, 30 dB superior quando demodulado através de um filtro de 2500 Hz do nosso recetor do que seria se a largura de banda fosse reduzida a somente 2,5 Hz.  
É precisamente essa deterioração que acontece nos nossos recetores típicos, justamente pela largura de banda do filtro de referência ser de 2500 Hz, isto é, relação sinal-ruído percecionada pode estar degradada em 30 dB.  
Nesse caso, o valor real dessa degradação reflete-se nos valores calculados da seguinte forma:

SNR(2500Hz) equivale a: SNR(2.5Hz) – 30, ou seja, +7 dB – 30 dB = -23 dB.

Na realidade, para a sensibilidade limite SNR = −28 dB do modo JT65 em largura de banda de 2500 Hz, obtemos os seguintes resultados:

Eb/N0 = −28 dB − 10*log10(72/47.8/2500) = +4.2 dB

Partimos do princípio que uma relação sinal-ruído negativa inviabiliza qualquer receção, mas aparentemente não é totalmente assim.  
C. E. Shannon descobriu através de cálculos matemáticos [4] que a comunicação descodificável só será possível até ao limite de -1.6 dB, através da fórmula:

Eb/N0 > 10*log10(ln(2)) = −1.6 dB

Se quisermos converter este resultado para a nossa habitual escala de relação sinal-ruído numa largura de banda de 2500 Hz, comum no Serviço de Amador, podemos usar a seguinte conversão:

SNR > −1.6 dB + 10*log10(70/50/2500) = −34.1 dB

Os ensaios efetuados nesta experiência foram, no entanto, extremamente descomplicados e consistiram basicamente na emissão e descodificação simultânea de uma mensagem matriz, igualmente testada para todos os modos digitais de radiocomunicação escrita identificados mais abaixo, na tabela de resultados.  
Essa matriz consistia no seguinte texto de 76 “palavras”, ou melhor, 392 símbolos ou 463 campos (símbolos + espaços) a serem descodificados:

Testing satellite QO-100 de CT1ETL, CT1ETL, CT1ETL testing only, from Lisbon (IM58jr).  
This is not a CQ call for QSO, but only an emission planned to conduct live experiments with several digital modes in QRP, assessing the viability of such digital modes.  
If you want to schedule a QSO on this mode, please send me an e-mail to ct1etl@gmail.com.  
Thank you for your understanding.  
Testing satellite QO-100 de CT1ETL, CT1ETL, CT1ETL testing only, from Lisbon (IM58jr).

A composição desta mensagem foi concebida por forma a identificar o tipo de teste que estava em curso, servido simultaneamente de informação destinada às autoridades responsáveis pela administração do espectro radioelétrico nos diferentes países abrangidos pela cobertura do satélite QO-100, assim como a outros utilizadores do mesmo que, eventualmente, a viessem a descodificar.

Existiu igualmente a preocupação no emprego de um conteúdo que não fosse demasiado extenso para os períodos de transmissão em modos de emissão mais prolongada (WSQ, JT9, THOR Micro, FSQ2, THROB1, etc.), nem demasiado breve para os de alta velocidade (Hellschreiber Feld-Hell X9, Hellschreiber Feld-Hell X5, BPSK500, QPSK500, etc.).

Adicionalmente, a repetição desta mensagem em todos os modos testados permitiu calcular-se o cômputo da percentagem de descodificação através de um método muito mais acessível, que consistiu simplesmente na contagem dos resultados obtidos nos 463 campos a serem descodificados com sucesso.

Cada sessão da bateria completa de transmissões em todos os modos digitais de radiocomunicações testados que serviram para o apuramento dos resultados teve lugar em datas distintas, uma vez que, quando a emissão ocorre em condições marginais, como no caso destes ensaios, as consequências negativas de alguns fatores de propagação, atenuação ou absorção dos sinais não se apresentam constantes ao longo dos dias.

A realização da bateria de emissões numa única data enviesaria a obtenção de um resultado confiável e equivalente para todos os modos digitais testados.

Em todos os ensaios feitos com os diferentes modos e suas distintas tipologias, na cópia (instância) do programa informático destinada somente à emissão, o conteúdo escrito da matriz anteriormente reproduzida foi carregado na íntegra para a janela ou célula destinada ao texto a emitir.

Todas as condições foram sendo constantemente verificadas antes do início de cada transmissão, com o objetivo de se cumprirem exatamente os mesmos parâmetros para cada transmissão.

Na cópia do programa informático (instância) destinada somente à receção, o inibidor de ruído foi colocado na posição mínima, mas não foi totalmente desativado. O objetivo foi evitar-se o aparecimento de “lixo” na janela de descodificação, isto é, carateres indefinidos e não resultantes de descodificação real oriunda de uma emissão específica, mas decorrentes de interpretações aleatórias da máquina em relação aos estímulos provocados pelo ruído gaussiano branco aditivo ou por interferências.

Já os modos digitais de comunicação simplificada (ou de sequenciamento automático) foram utilizados somente como controlo, ou seja, como ponto de partida para comparação de resultados em relação à sensibilidade e ao valor mínimo da relação sinal-ruído para descodificação. Nas emissões efetuadas no âmbito do grupo de controlo foi somente utilizada a sequência protocolada para uma das estações, isto é, uma emissão forçada das linhas TX1, TX3 e TX5, com intervalos de duração equivalente a estas transmissões, simulando-se as respostas (linhas TX2, TX4 e TX6).

Para além de inúmeros contactos reais efetuados em FT4 e FT8 através do satélite QO-100, os quais ocorreram ao longo de vários dias, foram testados, da forma narrada anteriormente, os modos FT4, FT8, JT65, JT9 e Q65, imediatamente antes de cada sessão dedicada a testar os modos de comunicação não simplificada, como grupo de controlo.

Na sessão selecionada para apuramento de resultados, todos esses modos digitais de comunicação simplificada demonstraram ser extremamente robustos e foram descodificados a 100%, isto é, a respetiva descodificação aconteceu sempre à primeira tentativa em cada uma das linhas.

A única exceção foi o modo JT9, o qual registou elevada taxa de insucesso pelo facto de persistir uma ligeira instabilidade de frequência ocorrida durante as respetivas emissões, em virtude da disponibilidade de satélites recebidos pelo GPSDO que forneceu o mesmo padrão de frequência a todos os equipamentos anteriormente descritos em ambos os circuitos.

Uma vez que o modo JT9 possui largura de banda muito estreita (20 Hz) a respetiva descodificação não demonstrou ser suficientemente tolerante à deriva na frequência fundamental verificada em determinados momentos.

Os modos digitais de comunicação não simplificada experimentados foram: DominoEX, Hellschreiber, Contestia, MFSK, MT63, FSQ, IFKP, BPSK, QPSK, 8PSK, PSK, Olivia, RTTY, THOR, Throb, WSQ e ROS, incluindo todas as diferentes variantes de velocidade de escrita, largura de banda e outras que os programas informáticos dispunham para cada um.

[3] <https://www.pa3fwm.nl/technotes/tn09b.html>  
[4] C. E. Shannon, (1948). A Mathematical Theory of Communication, The Bell System Technical Journal, Vol. 27, pp.379-423, 623-656.

## Resultados

Apresentam-se seguidamente os resultados obtidos nos modos digitais de radiocomunicações que obtiveram taxas de descodificação superiores a 40%.

Por uma questão de economia de espaço, inclui-se no exemplo somente a transcrição fiel da mensagem recebida em dois dos modos digitais, de entre os que alcançaram uma percentagem relevante de sucesso na descodificação, tendo ambos os exemplos atingido igual valor.

Solicita-se a melhora atenção, nesta comparação, para a diferença verificada entre os trechos da mensagem ou símbolos mais ou menos relevantes para o sucesso de comunicação, conforme irá ser mais bem apurado no capítulo das conclusões.

Na tabela que se seguirá mais adiante, ilustram-se igualmente os resultados obtidos para cada um dos modos digitais de radiocomunicações com os quais foi possível alcançar o maior sucesso na descodificação dos símbolos emitidos.

Exemplos de receção:

IFKP 0.5  
Duração total da emissão – 4:52 minutos  
Taxa de sucesso na descodificação 85% (335 símbolos descodificados num total de 392).

xwbNe djpuc iiplluAwucyzor1mTestpning skv1tellitvie QOm8100 de CT1e pCL, CT1ETO.si.CT1Eta.Lbytesti=ng only, vdkrom Lzosbon r@±M5h aqyR-.qn onThis igk not a CQ call for QSjD, but onloi an emirsionjqplannjued to zionductpo lifuze expe*iments with severmral  
digital.modes in p1RP, andsessing the viability of such digital modes.  
If you want toolschedule a QSO on this mode, please sendmr me?dn .j-mail hkokt ctaf;vo xl@gPail.cozsoj  
Thanezk you for your undelestan4kng.op c  
fMesfytinox sor=tell9ve QO-100 de.CTab.ETL.th CT1ETL, CT1ETLcxtesting?rnly, from lugIvbon (IbJ5r-jrm5.eiffkipvkgzvteuw.ihfk

DominoEX 4  
Duração total da emissão – 3:10 minutos  
Taxa de sucesso na descodificação 85% (336 símbolos descodificados num total de 392).

aaai% o tinTLETL,CS1ETL, CT1ESL testing only, from Lisn (IM58jr).  
This is ot a CQ call for Q0O, but only an kission erlanned to condudo i  
experiments wit severaddigital mobes in QRP, aspessing tye viability of such digital modes.  
If you want to schedule a QSO on edi r mode, pltose send ke an e-mail ta co1etl@gfail.com.  
Thank you for your understanding.  
Testing sateslite QO-100 de CT1ESL, CT1ETL, CT1ETL testing only, from Lisbon (IM58jr)-

Tabela completa de resultados onde se incluem os modos de radiocomunicações do grupo de controlo e os resultados daqueles onde se obteve uma descodificação com uma taxa superior a 40%:

Designação do modo de  
radiocomunicações digitais| Taxa de  
descodificação  
obtida| Largura de  
banda| Modulação| Designação ITU| Taxa de  
símbolos  
(Baud)| Relação sinal-  
ruído mínima  
(estimada)  
@ 2500 kHz  
---|---|---|---|---|---|---  
FT4 (grupo de controlo)| 100%| 83 Hz| 4-FSK| 83HF1D| 12,50| -21 dB  
FT8 (grupo de controlo)| 100%| 50 Hz| 8-FSK| 50HF1D| 6,25| -23 dB  
JT9 (grupo de controlo)| > 40% *| 16 Hz| 9-FSK| 16HF1B| 1,70| -27 dB  
JT65 (grupo de controlo)| 100%| 180 a 710 Hz| 65-FSK| 180HF1B/710HF1B| 2,69| -24 dB a -28 dB  
Q65 (grupo de controlo)| 100%| 19 a 433 Hz| 65-FSK| 19HF1B/433HF1B| 3,40| -23 a dB -30 dB  
THOR-4| 100%| 70 Hz| IFK| 70HF1B| 3,90| -16 dB  
ROS-4| 100%| 2000 Hz| 144-MFSK| 2K50J2D| 4,00| -22 dB  
Olivia 8-250| 96%| 250 Hz| 8-FSK| 250HF1B| 31,25| -12 dB  
Olivia 4-250| 95%| 250 Hz| 4-FSK| 250HF1B| 62,50| -15 dB  
ROS-8| 92%| 2500 Hz| 144-MFSK| 2K50J2D| 8,00| -19 dB  
DominoEX45| 85%| 173 Hz| IFK| 173HF1B| 3,91| -15 dB  
IFKP+| 85%| 386 Hz| IFK+| 386HF1B| 3,65| -15 dB  
THOR-8| 84%| 140 Hz| IFK| 140HF1B| 7,82| -13 dB  
DominoEX Micro| 48% *| 36 Hz| IFK| 36HF1B| 2,00| -15 dB  
ROS-16| 43%| 2000 Hz| 144-MFSK| 2K50J2D| 16,00| -16 dB  
THOR Micro| 41% *| 36 Hz| IFK| 36HF1B| 1,95| -18 dB  
Tabela completa de resultados onde se incluem os modos de radiocomunicações do grupo de controlo e os resultados daqueles onde se obteve uma descodificação com uma taxa superior a 40%

[*] nota: estes resultados foram visivelmente afetados sempre que se verificou alguma deriva de frequência durante a transmissão/descodificação, causada por uma diminuição comprometedora de satélites detetados pelo GPSDO.

## Conclusões

Foram testados 22 modos (protocolos) de radiocomunicações digitais, incluindo todas as respetivas variantes em emissões independentes para cada uma, perfazendo um total de 142 emissões por cada sessão completa.

Ao colocarem-se à prova a maioria dos modos digitais testados através de um único programa informático, tentou-se evitar um enviesamento provocado por diferentes níveis de prestação entre programas distintos, como no teste de comparação entre programas dedicados ao modo RTTY patente na página da Afreet Softwarte, Inc. [5].

Infelizmente nem todos os modos digitais de radiocomunicações disponíveis no Serviço de Amador podem ser encontrados num único programa informático e alguns programas informáticos são especializados num único modo, como o caso dos programas ROS e WSQ2, testados neste artigo.

Conquanto existam ótimas ferramentas de simulação, como o “HF Path Simulator Project” [6], somente a título de exemplo, tal como a própria designação assim o define, esta ferramenta destina-se à simulação de transmissões em Ondas Curtas, o que poderia não devolver resultados fiáveis para os testes em questão, realizado em frequência muito superiores aos 30 MHz.

Através dos ensaios realizados e descritos neste artigo, realçam-se algumas conclusões interessantes a começar por fatores que não estavam sequer em análise (ou ao menos previstos) e que contribuíram para um maior conhecimento sobre a operação nas bandas S e X com potências de emissão reduzidas.

A repetição dos ensaios em 3 datas (sessões) distintas, permitiu chegar-se a uma primeira conclusão que superou o âmbito inicialmente conjeturado para esta pesquisa.

De facto, como consequência dos baixos níveis de potência de emissão empregues, confirmou-se que foram factualmente testadas condições marginais para as radiocomunicações através do transpositor de banda estreita do satélite QO-100.

Um dos primeiros desfechos resultantes desse facto foi a perceção da forma como uma ligeira mudança na posição do alimentador pode resultar num incremento ou diminuição assinaláveis do sinal emitido e de como é importante calibrar este tipo de sistema irradiante, respeitando-se, o melhor possível, o ponto focal do refletor paraboloide.

Através da monitorização das transmissões da própria estação, que teve lugar permanentemente através da ligação descente do satélite, foi igualmente possível testemunharem-se oscilações nos níveis de sinal rececionado nos diferentes dias (sessões), muito provavelmente em resultado de previsível influência de fatores de absorção e atenuação originados, entre outras potenciais fontes, na meteorologia e no comportamento da atmosfera terrestre.

Regista-se que, embora se mantendo inalterável a constituição de ambos os circuitos da estação, assim como a potência de emissão foram registados, no período em que as diferentes sessões tiveram lugar, valores habituais compreendidos entre o nível de ruído gaussiano branco aditivo médio de, aproximadamente, -93 dBm (ou +14 dBμV) e, no limite mais elevado das emissões registadas sem atuação do sistema LEILA (incluindo as balizas de referência), na ordem de, aproximadamente, -53 dBm (ou +54 dBμV).

Na relação sinal-ruído registada no modo FT8 através da monitorização dos sinais do circuito emissor da estação, obtiveram-se valores da relação sinal-ruído no circuito recetor compreendidos entre -15 dB e -21 dB para uma largura de banda de 2500 Hz, conforme as datas, sendo as variações verificadas numa mesma sessão muito menos significativas, na ordem de 1 dB a 3 dB, no máximo.

Na sessão em que se registaram os níveis médios de sinal mais débeis, ocorreram falhas não negligenciáveis na descodificação em praticamente todos os modos testados, até entre aqueles do grupo de controlo, como o JT65, descrito pela literatura como sendo ainda mais robusto do que o FT8, mas que, em virtude de valores da relação sinal-ruído compreendidos entre os -20 dB e -21 dB, principiou a falhar na descodificação, à primeira tentativa, de uma ou outra linha.

Nos modos de comunicação digital escrita, verificou-se um aumento significativo no número de símbolos não descodificados ou mesmo a perda integral da comunicação nessa mesma sessão.

Em contraste, na sessão em que se registaram as médias de sinais mais fortes, o modo Olivia-8/125 assinalou uma taxa de sucesso de 100%, por exemplo.

Com potências de emissão compreendidas entre os 600 Watts P.I.R.E. e o valor máximo admissível de 950 Watts P.I.R.E. nenhuma alteração do sinal por efeitos de propagação, absorção ou atenuação é relevante ou chega a ser percetível. Estas alternâncias de sinal são praticamente desconhecidas para muitas das estações ativas nas radiocomunicações através do satélite geoestacionário QO-100 (até mesmo no transpositor de banda estreita) e percebe-se a justificação para que assim seja.  
Em face das oscilações de sinal verificadas, como consequência de as emissões terem tido lugar em baixa potência, foi tida em consideração somente uma das sessões, precisamente aquela em que os valores registados se revelaram medianos, tendo sido ignoradas as duas restantes.

Outra surpresa assinalável esteve relacionada com a robustez (ou a ausência dela) nalguns modos.

Os dececionantes resultados obtidos com o programa informático WSQ2 podem ter ficado a dever-se a uma deficiente configuração de parâmetros ou ao facto de o mesmo ter sido concebido para enfrentar as condições específicas de propagação dos sinais em Ondas Longas e Ondas Médias.

Modos de radiocomunicações digitais extremamente populares como PSK-31 e RTTY, foram largamente superados por outros menos utilizados como THOR, DominoEX e IFKP, sendo o modo Olivia, um dos mais robustos nestes testes, um caso intermédio em termos de popularidade.

Segundo os dados apurados nestes ensaios deu-se um interessante nexo de coincidência em relação à robustez dos modos em cujas portadoras é utilizada a modulação do sinal codificada por chaveamento de frequência múltipla, assumindo significativa evidência os modos com chaveamento em frequência incremental, o que adensa ainda mais o mistério do insucesso obtido com as emissões em WSQ.

Igualmente merecedor de destaque foi a ligeira variação de frequência no sinal em alguns Hz, embora insignificante para as radiocomunicações correntes em telefonia, prejudicou visivelmente a descodificação da mensagem em modos digitais de banda muito estreita, considerados extremamente robustos, como é o caso dos exemplos THOR Micro, DominoEX Micro e JT9 (este último pertencente ao grupo de controlo).

Em todos estes exemplos, aconteceram períodos de descodificação plena, coincidente com os momentos específicos em que a frequência de emissão se manteve estável.  
São ambos alternativas muito interessantes no caso das estações que disponham de uma solidez de frequência aceitável para a sua utilização.

Ainda que visivelmente igualmente prejudicados por alguma deriva na frequência fundamental, os modos THOR Micro, DominoEX Micro superaram o modo JT9, pertencente ao grupo de controlo, o qual apresenta, no entanto, menos 16 Hz de diferença em relação aos restantes.

É importante referir que, de acordo com os resultados obtidos, se constata que o modo DominoEX Micro, por exemplo, embora tenha sido projetado para as faixas de frequência em Ondas Longas e Ondas Médias no Serviço de Amador (2200 metros, 630 metros e 160 metros), pode perfeitamente vir a ser utilizado, com vantagem, em frequências muito superiores. Está descrito como sendo tão robusto como os modos da família Olivia, ao qual se atribui uma descodificação perfeita com sinais de -15 dB na relação sinal-ruído, sendo igualmente tão estreito como o modo PSK31, devido à sua largura de banda de 36 Hz.

Como referido anteriormente, uma forma de aferição da relação sinal-ruído passa por calcular a analogia entre energia por bit e nível de ruído.

Para o modo THOR Micro, a energia por bit, a 25 watts, seria de 25 watts x 0,5 segundos, ou seja, 12,5 watts/segundo por símbolo, o que equivale a 3 watts/segundo por bit. Para Olivia 8-250, somente a título de exemplo, a energia por bit seria de 25 watts x 0,032 segundos ou 0,8 watt/segundo por símbolo, equivalendo 0,26 watt/segundo por bit.

Daqui se pode concluir que a intensidade efetiva do sinal THOR Micro é 11 vezes superior à do sinal Olivia 8-250.

O modo THOR Micro usa ainda um código FEC de decisão suave, o qual pode representar um ganho adicional de 7,5 dB, pelo que, em condições adversas e estando reunida uma maior precisão de frequência para se lidar com 36 Hz de largura de banda, pelo que, a escolha mais vantajosa recairia preferencialmente neste modo.

Uma pertinente nota que convinha destacar é precisamente o facto da diferença de robustez atestada entre modos digitais com código de correção de erro (código autocorretor), nomeadamente os que dispõem de correção de erro direta ou correção adiantada de erro (Forward Error Correction) e os restantes.

Igualmente digno de registo será um dos motes que inspiraram esta iniciativa e que se resume na seguinte questão – estarão os tradicionais modos digitais de radiocomunicação escrita com as melhores prestações detetadas neste ensaio à altura de poderem competir em popularidade com os modos digitais de comunicação simplificada que mudaram para sempre o radioamadorismo?

Recorda-se, a propósito, que no decurso de uma feliz combinação de formas de propagação dos sinais que ocorreu em 144 MHz, no dia 29-05-2020, teve lugar uma quantidade considerável de contactos no modo FT8 entre Cabo Verde e inúmeros países da Europa Central, possibilitando uma distância máxima próxima dos 5600 quilómetros, entre aquele arquipélago e a Polónia.

Nessa ocasião, muitas outras distâncias incomuns poderiam ter sido alcançadas através de modos digitais mais robustos, inclusivamente disponíveis no mesmo programa informático (WSJT-X), porém, quando inúmeras vezes a questão foi colocada, nomeadamente nos fóruns de discussão na Internet, a esmagadora maioria dos intervenientes foram unânimes em questionar… quem é que atualmente tem paciência para contactos com a duração de 6 a 12 minutos, quando possui alternativas de 90 segundos?

A motivação para a adesão a modos que necessitam de mais de 90 segundos para se completar um contacto dependerá muito das condições de operação (nomeadamente do grau de dificuldade do contacto em virtude das condições de propagação dos sinais ou de fatores de atenuação).  
Quando as condições ideais não estão reunidas, procuramos modos de radiocomunicações mais eficientes para lidarmos com o problema.

A crescente impaciência demonstrada pela duração dos contactos e indiscutível popularidade dos modos digitais de comunicação simplificada, levantam uma questão pertinente – O que é rápido e o que é lento?

De acordo com a página “words per minute” da Wikipedia® “The Free Encyclopedia” [7], indivíduos adultos (da faixa etária compreendida entre os 18 e os 60 anos de idade), exibem uma velocidade média de escrita à mão de 40 letras por minuto (aproximadamente 8 palavras por minuto), variando de um mínimo de 26 a um máximo de 113 letras por minuto (aproximadamente de 5 a 20 ppm). No entanto, um estudo baseado nos registos de entrevistas para forças policiais nos Estados Unidos da América refere que a velocidade mais alta registada se situou na faixa compreendida entre 120 a 155 caracteres por minuto, sendo o limite mais elevado atingido por um candidato que chegou aos 190 caracteres (legíveis) por minuto.

Ainda segundo a mesma fonte, é bom relembrar que o código Morse, utilizado em telegrafia, usa sequências de comprimento variável de sinais de curta e longa duração, pontos e traços (ou travessões) para representar os caracteres. Essa variabilidade complica qualquer tentativa de avaliação da velocidade “real” do código Morse. Nas mensagens de telegrafia, o comprimento médio das palavras em inglês é de cerca de cinco caracteres, cada um com duração média de 5,124 baud.

É prática corrente usarem-se duas palavras-padrão diferentes para medir a velocidade do código Morse em palavras por minuto (ppm). Estas palavras são: “PARIS” e “CODEX”.  
No código Morse, “PARIS” tem duração equivalente a 50 pontos seguidos, enquanto “CODEX” tem a duração de 60 pontos.

O espaçamento entre as palavras deve ser igualmente considerado, sendo a respetiva duração de sete pontos nos Estados Unidos da América e cinco pontos nos países da Commonwealth.

Os Radioamadores telegrafam rotineiramente Código Morse a 20 ppm, mas os mais treinados podem atingir velocidades de até 60 ppm.

Para operadores que tenham de transcrever as mensagens em código Morse para o papel o limite estará próximo de 20 ppm. Já a decifração mental do código Morse, sem transcrição para o papel, pode atingir velocidades de 70 ppm, ou ligeiramente mais.

Várias fórmulas são usadas para a conversão da velocidade de transmissão dos modos digitais de radiocomunicações em palavras por minuto, nomeadamente as seguintes: (carateres por segundo / 5) * 60; baud por segundo * 1.2 ou ((baud por segundo / 10) / 5) * 60.

Para termos uma noção próxima das velocidades de transmissão convinha salientar que, nos ensaios efetuados, o modo digital THOR45 permitiu decodificar a mensagem a 100%, no entanto à custa de uma velocidade inferior à da telegrafia transcrita para o papel, situando-se nas 4,7 ppm.

Já o modo DominoEX 45, utilizando a mesma largura de banda, mas apresentando uma taxa de descodificação de apenas 85% nos testes efetuados, atinge exatamente a mesma velocidade (4,7 ppm).  
É bom relembrar que nem sempre a percentagem de descodificação de carateres se reflete de forma linear em termos de legibilidade.

Um contacto em FT8 é realizado à velocidade de 7,5 ppm e em FT4 aproximadamente ao dobro dessa velocidade, enquanto em ROS 16 se desenrola a 19,2 ppm e pode chegar a 600 ppm em BPSK500 e mesmo ao dobro 1323 ppm em Hellschreiber Feld-Hell X9.

O grande desafio é encontrar-se uma boa relação entre velocidade e robustez.

Apesar de ser atribuída uma eficiência de escrita em cerca de 27% do modo IFKP em quando comparado com o modo DominoEX 45, nesta experiência atingiram ambos o valor de descodificação dos símbolos de 85%, no entanto, a legibilidade da mensagem descodificada pelo primeiro é inferior pelo facto de possuir menores frações de texto coerente, incluindo perda de informações importantes como o endereço de correio eletrónico, como fica patente pelos dois exemplos anteriormente lustrados.

Há, no entanto, pelo menos duas justificações válidas para optarmos por um modo de radiocomunicações digitais mais rápido, caso possamos de selecionar escolhas que apresentem robustez equivalente – quando podemos trabalhar muitas entidades num curto período de tempo, ou, quando as condições de propagação dos sinais são efémeras.

Uma vez que a segunda condição não se verifica nas radiocomunicações através de um satélite geoestacionário, ficará ao critério de cada um o respetivo nível de eupatia em relação a comunicações consideradas mais lentas, uma vez que, de acordo com a minha experiência pessoal anterior (e estes ensaios assim o demonstram), há uma analogia verificável entre a duração da emissão e robustez na descodificação, estando de igual forma evidenciada a relação entre largura de banda a rapidez na transmissão de dados.

Em teoria, quanto mais demorada for a emissão de uma mensagem maiores são as probabilidades de ser descodificada com sucesso nas condições mais adversas, mas essa velocidade pode ser aumentada com um incremento na largura da banda utilizada… ainda que possa resultar, desse mesmo incremento, uma perda de robustez e eficácia.

Dado que as radiocomunicações através de um satélite geoestacionário acontecem em condições muito previsíveis e consideravelmente estáveis é conjeturável que poucos estejam disponíveis para trocarem contactos de 90 segundos por uma boa “conversa de teclado” que possa durar mais de 10 minutos… exceto se a respetiva estação só estiver em condições técnicas de emitir o equivalente a 4,2 watts P.I.R.E. e não uns confortáveis 500 watts P.I.R.E. ou mais.

Se operarmos através de um dos modos mais lentos testados, o WSQ, utilizando-se o protocolo de comunicação em código Morse com as abreviaturas de um QSO padrão, incluindo-se letras minúsculas para indicativos e letras maiúsculas, com moderação, para códigos Q e siglas, atinge-se a eficiência máxima. No sítio de apresentação do programa WSQ2 [8], é apresentado o seguinte exemplo para uma emissão de 88 carateres e somente 3 minutos de duração: ge om name hr Fred. ur rst 569. loc RF77ee. hw? VK7XYZ de ZL1ABC K.

Para as estações QRP fica, no entanto, uma nova possibilidade de explorarem uma excelente alternativa para as radiocomunicações via satélite geoestacionário QO-100.

[5] Alex Shovkoplyas (Afreet Software, Inc). (2015, março 09). RTTY Software Comparison. consultada às 15:18, de 22 de outubro de 2023, em – <https://www.dxatlas.com/RttyCompare/>.  
[6] <https://www.moetronix.com/ae4jy/pathsim.htm>.  
[7] Contribuintes Wikipedia. (2023, August 28). Words per minute. Em Wikipedia, The Free Encyclopedia. Acedido às 12:52, de 06 de setembro de 2023, na hiperligação – [https://en.wikipedia.org/w/index.php?title=Words_per_minute&oldid=1172735339](https://en.wikipedia.org/w/index.php?title=Words_per_minute&oldid=1172735339).  
[8] <https://www.qsl.net/zl1bpu/SOFT/WSQ.htm>.
