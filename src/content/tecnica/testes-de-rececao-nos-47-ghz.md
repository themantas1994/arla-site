---
titulo: "Testes de recepção nos 47 GHz"
resumo: "Testes de recepção nos 47GHz, por Miguel Pelicano, CT1BYM (associado núm. 71) O dia 4 de Julho de 2022 ficará para sempre registado, para mim, como histórico: consegui receber uma emissão via reflexão lunar em…"
data: "2022-08-02"
categoria: "Micro-ondas"
etiquetas:
  - "47 GHz"
  - "EME"
  - "Micro-ondas"
  - "DX"
imagem: "/imagens/conteudo/47GHz_1.jpg"
imagemAlt: "Testes de recepção nos 47 GHz"
historico: false
destaque: false
urlAntigo: "/site/2022/08/02/testes-de-recepcao-nos-47-ghz/"
nivel: "avancado"
indice: true
autor: "Miguel Pelicano"
indicativo: "CT1BYM"
---

Testes de recepção nos 47GHz, por Miguel Pelicano, CT1BYM (associado núm. 71)

O dia 4 de Julho de 2022 ficará para sempre registado, para mim, como histórico: consegui receber uma emissão via reflexão lunar em 47GHz, com uma parabólica de 90cm!!  
  
Manfred, DL7YC, combinou com o grupo de desenvolvimento de sistemas, EA3HMJ, EB3FRN e comigo, CT1BYM, fazer uma emissão no final da tarde para teste de alguns componentes: LNA e guias de onda, sistema de tracking e antenas.  
  
O José, EA3HMJ, com uma parabólica de 1.2m, estaria sempre melhor equipado para receber a transmissão do que eu, com uma kathrein de 90cm.  
  
Mas, nestas frequências, a correção da superfície do espelho reflector é absolutamente crítica (ver as equações de Ruze sobre o espelho parabólico).

![](/imagens/conteudo/47GHz_1.jpg)

Fiz algumas medidas umas horas antes do teste. Estava um dia quente, 35º, 37% de humidade relativa, pressão atmosférica 1014 hPa.

![](/imagens/conteudo/47GHz_2.jpg)

A Lua estava perfeitamente “visível”, com quase 1dB de ruído, portanto era possível fazer o ajuste do tracking manualmente. O rotor usado nestes testes não é o mais adequado, portanto esta seria a unica solução possível… por enquanto!

O ajuste foi feito sempre monitorizando o SpectraVue, que, juntamente com o Rad II da LC Technologies, me iam fornecendo os dados que necessitava para apontar à Lua o melhor possível. Mas, não ter um sistema automático de pontaria, fazia com que eu não estivesse concentrado noutras áreas da experiência. Precisava de mais uns braços adicionais!

O Manfred, DL7YC, começou a transmitir ás 19:00 UTC, com 40W e uma parabólica de 2.4m. O grande desafio: seria possível receber a transmissão com uma sistema tão pequeno? Com 90cm seria muito complicado…  
Mas estava com bons valores de ruído Solar e ruído Lunar! 10dB de Sol e 1dB de Lua traduziam a eficácia do sistema que tinha montado, dando-me confiança para fazer o teste. O LNA com o NF de 1.8dB à temperatura ambiente e todos os subsistemas estavam a trabalhar na perfeição!

Consegui descodificar alguns ciclos, bons sinais, apesar do Spread estar a níveis de quase 900Hz!!!!  
Os sinais estavam tão bons que optei por fazer testes com o WSJT (Ftol, QRG, etc…), para dar alguma informação á equipe de desenvolvimento do software. Tem havido muitas modificações deste software com os testes atualmente a correr na Lua em 47GHz, e todos os momentos são preciosos para se tirarem as devidas conclusões.

A configuração com o indicativo, quando uma estação chama outra, aparentemente tem muita importância para o processo de descodificação. O Manfred chamou-me até ás 19:14, depois chamou o José, EA3HMJ.  
  
As imagens seguintes ilustram esses momentos, foram adquiridas em tempo real nesse teste:

![](/imagens/conteudo/47GHz_3.jpg)

![](/imagens/conteudo/47GHz_4.jpg)

![](/imagens/conteudo/47GHz_5.jpg)

Não tive mais descodificações como “CT1BYM”, decidi, por isso, alterar a configuração para “EA3HMJ”

![](/imagens/conteudo/47GHz_6.jpg)

E lá estava o reporte de Manfred para o José!! Para testar, porque ainda não estamos a emitir. Tudo isto é um longo processo, muito trabalho já foi feito, ainda falta muito para fazer! Dias depois, fiz um pós processamento aos ficheiros guardados no dia do teste.

![](/imagens/conteudo/47GHz_7.jpg)

O Spread começou perto de 860Hz, como se pode ver na primeira imagem.

O José, EA3HMJ, conseguiu descodificar mais ciclos do que eu. Ele fez um sistema de tracking absurdamente bom!! Um luxo! E é assim que o mundo evolui, pela boa utilização das capacidades de todos…  
  
O ajuste manual não é opção, vai ser alterado nos próximos meses. A antena também… muito trabalho ainda pela frente!  
  
O Iban, EB3FRN, e o José, EA3HMJ, estão a desenvolver um SSPA para 47GHz, os resultados têm sido muito promissores.

Condições de trabalho: Kathrein offset 90cm, sistema duplo, IC-9700 e IC-R8600, 2 computadores, RFSpace SDR-14, LNA com 1.8dB NF da equipe espanhola de mmW (EB3FRN, EA3HMJ, EA5DOM), com um soberbo wirebonding de Iban e ajustes no seu laboratório, sistema de guia de ondas em WR19 e WR22 com adaptadores, feed para um f/D=0.66 (W2IMU), torneado pelo José, transverter Kuhne, referência GPSDO HP 58503A.

73, Miguel  
CT1BYM
