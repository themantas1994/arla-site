---
titulo: "Weak Signals – Sinais Fracos – Micromeet 2021"
resumo: "Weak Signals – Sinais Fracos Apresentação do Micromeet 2021 2.ª Parte – Comunicações através de Reflexão Lunar – EME por Miguel Pelicano, CT1BYM (associado núm. 71) As comunicações usando a Lua como reflector…"
data: "2021-04-27"
categoria: "Micro-ondas"
etiquetas:
  - "Sinais fracos"
  - "Micro-ondas"
  - "Radioastronomia"
  - "EME"
imagem: "/imagens/conteudo/micromeet_2021_18.jpg"
imagemAlt: "Weak Signals – Sinais Fracos – Micromeet 2021"
historico: false
destaque: false
urlAntigo: "/site/2021/04/27/weak-signals-micromeet-2021-2/"
nivel: "avancado"
indice: true
autor: "Miguel Pelicano"
indicativo: "CT1BYM"
---

Weak Signals – Sinais Fracos

Apresentação do Micromeet 2021

2.ª Parte – Comunicações através de Reflexão Lunar – EME

_por Miguel Pelicano, CT1BYM (associado núm. 71)_

As comunicações usando a Lua como reflector, ou EME (Terra-Lua-Terra), apresentam alguns dos desafios técnicos e operacionais mais significativos para o rádio amador. Desde o primeiro QSO amador bidirecional através da lua em 1960, ele foi seguido por muitos outros em todas as bandas amadoras de 28 MHz a 24 GHz (com testes em andamento em 47 e 77 GHz).

No início, as estações de EME precisavam de sistemas de antenas enormes, transmissores de alta potência e configurações de recepção complexas. Hoje, a operação EME está ao alcance da maioria dos amadores com uma capacidade razoável de estação VHF e permite QSOs de longa distância entre muitos países em todo o mundo.

O desafio surge devido a uma combinação de fatores que o tornam interessante e gratificante:

  * A lua está a uma distância média de cerca de 380.000 km de distância;
  * É um refletor RF relativamente pobre (só cerca de 6% da energia é refletida);
  * O movimento relativo com a Terra requer sistemas de rastreamento bastante precisos;
  * A comunicação está sujeita a alterações de Doppler, Libração e Polarização.

Na prática a Reflexão Lunar ocorre regularmente em todas as bandas amadoras de 50 MHz a 24 GHz, com 144 MHz e 1296 MHz de longe as bandas mais populares para atividade. Alguma atividade EME ocorreu mesmo nas bandas amadoras de 21 e 28 MHz.

Uma das características únicas da EME é que é possível ouvir e observar os seus próprios ecos, que chegam ao Rx aproximadamente 2,6 segundos depois, conforme o sinal transmitido se propaga da Terra para a Lua, é refletido e se propaga de volta para a Terra.

Durante qualquer mês lunar (aproximadamente 28 dias), se dois lugares do globo estiverem com visibilidade mútua da lua, podem ocorrer comunicações por EME. No extremo, isso pode durar apenas alguns minutos, mas em separações mais curtas, como na Europa ou entre a Europa e a América do Norte, a lua pode ser mutuamente visível por muitas horas de cada vez.

Embora a maioria dos modos tenha sido usada em EME, até recentemente o CW dominava. No entanto, o advento dos modos digitais de sinal fraco, como o JT65 e o QRA64 (que agora foi substituído por Q65), levou a um aumento significativo na sua popularidade. Devido à vantagem de uma maior sensibilidade dos modos digitais, é possível usar antenas menores e menor potência de transmissão, o que permite que muitos mais rádios amadores se envolvam em EME.

Os sinais refletidos na Lua chegam à estação receptora extremamente fracos, a atenuação situa-se perto dos 290dB e, nalguns casos mais ainda! Porque, além da distância e da fraca reflectividade da Lua, temos que acrescentar a absorção pelo vapor de água, chuva, oxigénio, e a dependência de alguns desses parâmetros com a pressão atmosférica, a temperatura…etc… tudo vai depender da frequência de operação…

Acima de 432MHz é comum usarem-se antenas parabólicas. O tamanho efectivo dessas antenas deve ser visto em Comprimentos de Onda, só assim ficamos com uma noção correcta das características eléctricas… e necessidades mecânicas.  
  
Como já referi no artigo anterior, estou a utilizar agora uma parabólica de 3 metros de diâmetro, foco primário, revestida com uma malha metálica com furações de 1.2mm x 1.2mm.

Uma parabólica de 3m de diâmetro em 1.2GHz mede 13 comprimentos de onda, em 10GHz mede 103.4 comprimentos de onda.

Enquanto que em 1.2GHz tenho uma abertura de feixe a -3dB de 5.4⁰, em 10GHz a abertura de feixe a -3dB é de 0.675⁰ ! O que é que isto significa? Que em 1.2GHz o sistema de rotor (azimute e elevação) poderá ter a resolução de 1⁰, em 10GHz ter um sistema com 0.1⁰ de resolução se calhar é pouco… porque a Lua apresenta um ângulo sólido aparente de 0.5⁰…

Uma antena parabólica de 3m para 10GHz corresponde a uma parabólica de 23.9m para 1.2GHz… para termos a noção prática das coisas…

A calibração do sistema é feita com o Sol, medindo o ruído solar. Também se pode afinar com o ruído recebido da Lua, que é o que eu faço em 10 e 24GHz. Assim tenho sempre a certeza que a antena está bem apontada.

A maneira mais simples que eu conheço para fazer esta medição é utilizar o software SpectraVue. No modo Continuum, com a entrada em audio e Rx com AGC Off, podemos comparar a relação em dB entre uma zona de céu sem ruído e o Sol (ou Lua) e, daí, perceber se estamos a apontar na direcção correcta. Como a posição do Sol é conhecida, calibramos assim o sistema de tracking. O mesmo se passa com a Lua, permitindo um ajuste mais fino do sistema de seguimento mecânico.

Na figura seguinte pode ver-se o ruído da Lua, obtido com uma parabólica de 1.2m e um LNA de 1.7dB NF em guia de onda WR42.

![](/imagens/conteudo/micromeet_2021_18.jpg)

O Doppler devido ao movimento da Lua terá necessáriamente que ser compensado. O equipamento tem que estar controlado via CAT para os modos digitais, sendo possível fazer esse controlo manualmente quando se trabalha CW. Mesmo quando temos um valor de Doppler perto dos 20kHz nos 10GHz… O software que utilizo para ter os valores de compensação para CW é o EMECalc do VK3UM (SK). Nos modos digitais, o WSJT-X tem a possibilidade de CAT, selecionando o tipo de compensação que pertendo.

Na figura seguinte está o exemplo do modo CFOM (Constant Frequency On the Moon), em que o valor total de Doppler é dividido por dois, ficando uma parte associada a Rx e a outra ao Tx.

![](/imagens/conteudo/micromeet_2021_19.jpg)

Nesta figura pode ver-se também parte das minhas configurações. Estava em QSO com o PA0BAT em 10368.190 MHz, CFOM.  
  
A Libração e o seu efeito também se vêm nesta figura: naquele momento havia um “spread” no sinal de 94Hz, por isso, em vez de um traço, a imagem da Water Fall apresenta uma “nuvem”. Esse espalhamento do sinal provoca uma receção ainda mais dificultada. O modo usado estava a ser o novo Q65, submodo D, período 60s.

Para garantir o contacto, deve escolher-se a altura com o mínimo de spread entre as duas estações. As variáveis são muitas, recorro a folhas de cálculo e software… mas por vezes há surpresas, por isso tento sempre! Mesmo quando tudo parece estar contra o QSO!

O valor de spread é directamente porporcional à frequência de trabalho, nos 23cm não tem grande influência, em 10GHz já faz mossa, nos 24GHz… um valor alto impossibilita o QSO! Nos 47GHZ e por aí acima então fica proibitivo!!

No site <http://moon.microwavers.es/> pode fazer-se o cálculo diário entre dois QTH locators.

Há dois beacons activos na Lua, ou melhor, a reflectir na Lua: em 23cm o ON0EME e em 10GHz o DL0SHF. As características podem ser vistas nestes sites:

<http://users.skynet.be/on0eme/ON0EME/Welcome.html>

<http://pa0ehg.com/dl0shf_beacon.htm>

São uma óptima ajuda para quem se inicia nestas lides, podendo servir para colocar em funcionamento e testar um sistema de Rx. Um bom LNA e baixas perdas antes do Feed são absolutamente necessários! É aqui que se determina a Figura de Ruído total do sistema de Rx!

A polarização que se utiliza é a Polarização Circular dos 1.2GHz até aos 10GHz e a Polarização Linear dos 10GHz para cima, inclusivé. As estações europeias estão em vertical, as estações americanas em polarização horizontal. Há estações que têm sistemas mecânicos para fazer a rotação de polarização, optimizando assim o contacto. Houve um grande debate sobre a utilização deste tipo de polarização, neste momento é o que está aceite pela maioria de nós.

No próximo artigo vou dar algumas sugestões de sistemas simples, até lá os meus votos de bons testes!!

73, Miguel, CT1BYM
