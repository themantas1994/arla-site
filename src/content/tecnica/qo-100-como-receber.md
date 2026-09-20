---
titulo: "Como receber o QO-100"
resumo: "Como receber o OSCAR 100 por Miguel Pelicano, CT1BYM (associado núm. 71) Alguns colegas têm-me perguntado como é que se consegue receber o novo satélite geoestacionário, QO-100. Vou dar algumas dicas…"
data: "2019-01-01"
categoria: "Satélites"
etiquetas:
  - "QO-100"
  - "Satélites"
  - "LNB"
  - "SDR"
autor: "Miguel Pelicano"
indicativo: "CT1BYM"
imagem: "/imagens/conteudo/qo100_1_1.jpg"
imagemAlt: "Como receber o QO-100"
nivel: "introducao"
indice: false
urlAntigo: "/site/qo-100_1/"
---

**Como receber o OSCAR 100**  
_por Miguel Pelicano, CT1BYM (associado núm. 71)_

Alguns colegas têm-me perguntado como é que se consegue receber o novo satélite geoestacionário, QO-100.

Vou dar algumas dicas, descrevendo aquilo que eu fiz, havendo, como é evidente, várias maneiras de conseguir.

A primeira dificuldade é descobrir em que direção apontar. Um site que nos dá um resultado bastante intuitivo é o site [www.dishpointer.com](http://www.dishpointer.com/)

![qo100_1_1](/imagens/conteudo/qo100_1_1.jpg)

O funcionamento é simples: escolher o satélite, que no nosso caso é o Arabsat 5 (posição orbital 26ºE), colocar as nossas coordenadas e, no mapa, vemos imediatamente a direção e em rodapé outros dados. Se arrastarmos o marker para o local exato da instalação, podemos usar como referência outros edifícios ou o relevo para apontar a antena. A elevação e o skew também estão indicados. O skew é a torção do LNB relativamente à vertical.

O setup mais básico que usei foi este:

![qo100_1_2](/imagens/conteudo/qo100_1_2.jpg)

O LNB é alimentado com 13V através do cabo coaxial e um injector DC. Este LNB tem um PLL e, tendo alguma estabilidade, dá para ganhar experiência. O custo abaixo dos 7€ também ajuda…

O sinal que vem do LNB é injetado num SDR que sintoniza as frequências que resultam da mistura dos sinais de 10GHz com o oscilador local (LO) que deverá estar perto de 9,750GHz. Eu disse perto, porque na vida real o LO pode estar algo afastado…

Fazendo contas, a frequência do beacon do satélite está em 10489.550MHz, misturado com o LO em 9750MHz resulta na frequência de 739,550MHz e é esta que temos que receber no SDR.

![qo100_1_3](/imagens/conteudo/qo100_1_3.jpg)

No início usei uma parabólica com 40cm de diâmetro. Quanto maior, mais ganho, mais diretiva e mais crítica para apontar!

![qo100_1_4](/imagens/conteudo/qo100_1_4.jpg)

O satélite tem dois transponders: um Narrow Band (NB):

![qo100_1_5](/imagens/conteudo/qo100_1_5.png)

e outro Wide Band (WB):

![qo100_1_6](/imagens/conteudo/qo100_1_6.png)

O NB (comunicações em CW, SSB, etc) é recebido em polarização vertical (ajustada com o skew).

![qo100_1_7](/imagens/conteudo/qo100_1_7.jpg)

O WB (DATV, etc…) vem em polarização horizontal, tendo o LNB que ser rodado 90º, mantendo a tensão de alimentação.

![qo100_1_8](/imagens/conteudo/qo100_1_8.jpg)

O WB transponder é recebido da mesma maneira, mas para descodificar os sinais de DATV é necessário um sistema adequado. Podem ver um sinal de DATV recebido na frequência em torno de 10489,750MHz, utilizando o mesmo hardware:

![qo100_1_9](/imagens/conteudo/qo100_1_9.jpg)

Bons testes e até já no Oscar 100!!

Autor: Miguel Pelicano, CT1BYM (associado núm. 71)
