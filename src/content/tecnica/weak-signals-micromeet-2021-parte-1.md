---
titulo: "Weak Signals – Sinais Fracos – Micromeet 2021"
resumo: "Weak Signals – Sinais Fracos Apresentação do Micromeet 2021 por Miguel Pelicano, CT1BYM (associado núm. 71) A edição deste ano da reunião de entusiastas das muito altas frequências, MICROMEET, que costumava…"
data: "2021-03-11"
categoria: "Micro-ondas"
etiquetas:
  - "Sinais fracos"
  - "Micro-ondas"
  - "Radioastronomia"
  - "EME"
imagem: "/imagens/conteudo/micromeet_2021_1.jpg"
imagemAlt: "Weak Signals – Sinais Fracos – Micromeet 2021"
historico: false
destaque: false
urlAntigo: "/site/2021/03/11/weak-signals-micromeet-2021/"
nivel: "avancado"
indice: true
autor: "Miguel Pelicano"
indicativo: "CT1BYM"
---

Weak Signals – Sinais Fracos

Apresentação do Micromeet 2021

_por Miguel Pelicano, CT1BYM (associado núm. 71)_

A edição deste ano da reunião de entusiastas das muito altas frequências, MICROMEET, que costumava realizar-se na sede da URE em Guadarrama, Madrid, vai ter lugar online, dia 28 de Fevereiro. Achou-se conveniente não deixar passar este ano sem que houvesse a habitual reunião de partilha de experiências e de conhecimentos, apesar das limitações impostas pela pandemia.

Fazendo parte da comissão organizadora, não podia deixar de prestar a minha contribuição. Decidi falar sobre alguns tópicos que têm por base a receção e tratamento de sinais fracos, baseado nas minhas atividades e tentando sempre ir ao lado prático do “como fazer”, desmistificando algumas ideias que, por vezes estão enraizadas no senso comum.

Já escrevi num outro artigo que estava a fazer alguns testes em radioastronomia. Uso para isso uma antena parabólica de 3m de diâmetro, de grelha, perfurada com buracos 1.2mm2. Este tipo de superfície permite a sua utilização até cerca dos 14GHz.

Para Radioastronomia uso um iluminador (feed) com polarização circular, LHCP, que, após a reflexão na superfície do espelho parabólico, passa a RHCP. Ou seja, muda de polarizção circular esquerda para polarização circular direita.

O feed é uma pequena antena helicoidal de 3 espiras, que ilumina suficientemente bem a parabólica que tem uma relação f/D=0.45. Não é o ideal, mas foi o que se arranjou, porque a vontade de experimentar sobrepôs-se ao resto…

Se estamos à espera das condições ideais, as oportunidades de fazer alguma coisa ficam cada vez mais reduzidas… por isso decidi avançar! E agora? Um LNA!! Um bom Low Noise Amplifier!

Tinha aqui um velhinho para os 23cm EME que resolvi experimentar, embora a frequência da Linha de Hidrogenio que queria receber estivesse por volta de 1420.405MHz. Disse “por volta de” porque, devido ao efeito Dopller, as frequências de receção ficam espalhadas no espectro, às vezes acima e outras vezes abaixo da tal frequencia de 1420.405MHz. E não vao aparecer como uma “linha”! Aparecem como uma, ou mais, “bossas”.

Obtive alguns resultados, algo afastado do que estava à espera. Decidi, por isso, investir num outro LNA, mais adequado para o tipo de serviço. Sem esquecer os Masers, lá para os 1.7GHz!!

Este foi o escolhido, já confirmei as especificações aqui no meu laboratório, está tudo correcto:

![](/imagens/conteudo/micromeet_2021_1.jpg)

O LNA tem que estar sempre o mais perto possível do feed para que as perdas sejam mínimas, ficando assim o sistema optimizado no que diz respeito à Temperatura de Ruído.

Como o sistema mecânico da parabólica é bastante complicado de alterar, decidi usar a mesma estrutura que utilizo para suportar o Septum Feed de 23cm.

O aspecto final é este, com um saco de plástico a envolver o LNA e o feed protegido com um tubo:

![](/imagens/conteudo/micromeet_2021_2.jpg)

A extremidade da helicoidal deve ficar no foco, e não a sua base reflectora! A posição final deste conjunto deverá ser confirmada através da medida do ruído solar.

Vou usar um SDR para análise de espectro e um radiómetro para a medida da potência total. O SDR é o SDR-14 (RFSpace) que chega aos 30MHz, o radiómetro é para ser ligado numa FI de 140MHz. O diagrama de blocos ficou assim:

![](/imagens/conteudo/micromeet_2021_3.jpg)

O acoplador direccional de -3dB vai permitir ter dois canais totalmente independentes para tratamento do sinal, ou seja, dois sistemas de receção independentes! Para isso uso dois misturadores cada um com o seu oscilador local a PLL. O primeiro protótipo ficou desta maneira:

![](/imagens/conteudo/micromeet_2021_4.jpg)

Um dos misturadores é atacado por um PLL da DxPatrol (ADF4351), o outro está ligado a um gerador de sinais da R&S. Os amplificadores de FI são material do eBay… vai-se experimentando até aparecer algum jeitoso!

O amplificador de linha é um MiniCircuits ZRL-2400LN, cobrindo a banda pertendida, os mixers usei uns ZX05-43H-S+, podendo ser usado qualquer outro dispositivo que faça as mesmas funções.

![](/imagens/conteudo/micromeet_2021_5.jpg)

O acoplador direccional de 3dB é da Anaren:

![](/imagens/conteudo/micromeet_2021_6.jpg)

Para iniciar os testes em radioastronomia não é forçosamente necessário que a antena possua rotor de azimute e elevação: pode ficar fixa e esperar que a Terra gire de maneira a que a zona do céu que nós queremos escutar atravesse o seu feixe num determinado momento. No meu caso, como este sistema é o mesmo que uso para EME, tenho um rotor com 0.1º de resolução, controlado pelos softwares PSTRotator e Radio-Eyes.

![](/imagens/conteudo/micromeet_2021_7.jpg)

Os resultados estão a ser francamente motivadores, havendo ainda um longo caminho a percorrer!

![](/imagens/conteudo/micromeet_2021_8.jpg)

![](/imagens/conteudo/micromeet_2021_9.jpg)

O sistema para receber as sondas espaciais (Deep Space) nos 8.4GHz surgiu como resposta a um pequeno desafio do EB3FRN, Iban, que me disse que eu só não estava a receber essas sondas porque não queria! Que tinha aqui tudo e, se não funcionasse como eu queria, funcionava mais ou menos… mas funcionava!!

Portanto… mãos à obra! O circuito que ainda não estava operacional, e que era necessário construir de raiz, seria o primeiro conversor, já que podia perfeitamente usar o circuito de frequência intermédia do sistema de radioastronomia, começando no amplificador de linha da MiniCircuits (1000-2400MHz). O conversor, que teria que ficar no foco da parabólica devido às perdas, apresenta na saída sinais no intervalo de frequências entre 1000MHz e 2400MHz.

O sistema final ficou com o seguinte diagrama de blocos:

![](/imagens/conteudo/micromeet_2021_10.jpg)

O feed que ainda estou a usar é o meu antigo de 10.3GHz e a única coisa que fiz foi ajustar a transição coaxial-guia de onda circular. Não é o mais adequado para iluminar convenientemente o espelho parabólico, nem devia estar com polarização linear. Devia estar com um depolarizer, um outro tipo de feed… portanto ainda muita coisa a mudar num futuro próximo!

![](/imagens/conteudo/micromeet_2021_11.jpg)

O misturador que estou a usar é um DXM511-1 da Times Microwave, bom até 26GHz e com 10dB de perdas de conversão. Exige um nível de 10dBm de oscilador local, e exige, igualmente, um nível apreciável na entrada de RF. Por isso, após o LNA, vem um buffer. Este conjunto tem sensívelmente 50dB de ganho. O PLL é o ZLPLL14G, referenciado a 10MHz, o mesmo que utilizo nos transverters de 24GHz para EME e em 47GHz.

![](/imagens/conteudo/micromeet_2021_12.jpg)

![](/imagens/conteudo/micromeet_2021_13.jpg)

Como umas imagens valem mais que mil palavras, deixo-vos aqui algumas. Houve alguns destes sinais que, por vezes, consegui escutar no altifalante!

Um dos “truques” para a recepção de sinais com níveis extremamente fracos é ajustar a resolução de banda passante (RBW) para valores abaixo de 1Hz (!). Nas imagens que se seguem, reparem na RBW.

![](/imagens/conteudo/micromeet_2021_14.jpg)

![](/imagens/conteudo/micromeet_2021_15.jpg)

![](/imagens/conteudo/micromeet_2021_16.jpg)

![](/imagens/conteudo/micromeet_2021_17.jpg)

Os temas que falei de seguida, EME (reflexão lunar) e Satélites, vão ficar para um próximo artigo. Até lá, vamos continuar as experiências, há um longo (mas interessantíssimo!) caminho a percorrer.

73, Miguel, CT1BYM
