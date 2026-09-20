export interface ItemNav {
  rotulo: string;
  href: string;
  descricao?: string;
  icone?: string;
  filhos?: ItemNav[];
}

/** Navegação principal. Editável aqui — é a única fonte de verdade do menu. */
export const NAVEGACAO: ItemNav[] = [
  { rotulo: 'Início', href: '/' },
  {
    rotulo: 'ARLA',
    href: '/arla/',
    filhos: [
      { rotulo: 'A ARLA', href: '/arla/', descricao: 'Fins, objetivos e área de implantação', icone: 'info' },
      { rotulo: 'História', href: '/arla/historia/', descricao: 'Cronologia desde 1999', icone: 'relogio' },
      { rotulo: 'Quem somos', href: '/arla/quem-somos/', descricao: 'Lista de associados', icone: 'pessoas' },
      { rotulo: 'Órgãos Sociais', href: '/arla/orgaos-sociais/', descricao: 'Direção, mesa da AG e conselho fiscal', icone: 'escudo' },
      { rotulo: 'Direção Técnica', href: '/arla/direcao-tecnica/', descricao: 'Quem mantém a rede', icone: 'ferramenta' },
      { rotulo: 'Ser associado/a', href: '/arla/ser-associado/', descricao: 'Como aderir, passo a passo', icone: 'estrela' },
      { rotulo: 'Quotização', href: '/arla/quotizacao/', descricao: 'Valor da quota e pagamento', icone: 'documento' },
      { rotulo: 'Documentos e Estatutos', href: '/recursos/documentos/', descricao: 'Estatutos, regulamentos e formulários', icone: 'documento' },
    ],
  },
  {
    rotulo: 'Radioamadorismo',
    href: '/radioamadorismo/',
    filhos: [
      { rotulo: 'Quero começar', href: '/radioamadorismo/comecar/', descricao: 'Primeiros passos, sem jargão', icone: 'estrela' },
      { rotulo: 'O que é o radioamadorismo', href: '/radioamadorismo/o-que-e/', descricao: 'História e sentido do hobby', icone: 'livro' },
      { rotulo: 'Ser radioamador', href: '/radioamadorismo/ser-radioamador/', descricao: 'As várias formas de praticar', icone: 'onda' },
      { rotulo: 'Artigos técnicos', href: '/tecnica/', descricao: 'Antenas, micro-ondas, modos digitais', icone: 'ferramenta' },
      { rotulo: 'Satélites e QO-100', href: '/radioamadorismo/satelites/', descricao: 'Comunicações por satélite', icone: 'satelite' },
      { rotulo: 'Meteorologia espacial', href: '/radioamadorismo/meteorologia-espacial/', descricao: 'Propagação e atividade solar', icone: 'onda' },
    ],
  },
  {
    rotulo: 'Rede ARLA',
    href: '/rede/',
    filhos: [
      { rotulo: 'Repetidores', href: '/rede/repetidores/', descricao: 'Frequências, tons e estado', icone: 'repetidor' },
      { rotulo: 'Balizas', href: '/rede/balizas/', descricao: 'CS5BLA em VHF, UHF e 1296 MHz', icone: 'antena' },
      { rotulo: 'APRS', href: '/rede/aprs/', descricao: 'Digipeaters CQ0PLA e CQ0PST', icone: 'rede' },
      { rotulo: 'CS5ARLA', href: '/rede/cs5arla/', descricao: 'A estação de uso coletivo', icone: 'onda' },
      { rotulo: 'Mapa da rede', href: '/rede/mapa/', descricao: 'Onde estão as estações', icone: 'mapa' },
    ],
  },
  {
    rotulo: 'Notícias',
    href: '/noticias/',
    filhos: [
      { rotulo: 'Notícias', href: '/noticias/', descricao: 'Comunicados e atualidade', icone: 'onda' },
      { rotulo: 'Eventos e atividades', href: '/eventos/', descricao: 'O que vem aí e o que já passou', icone: 'calendario' },
      { rotulo: 'Arquivo', href: '/arquivo/', descricao: 'Todo o conteúdo por ano', icone: 'livro' },
    ],
  },
  {
    rotulo: 'Recursos',
    href: '/recursos/',
    filhos: [
      { rotulo: 'Artigos técnicos', href: '/tecnica/', descricao: 'Biblioteca técnica da associação', icone: 'ferramenta' },
      { rotulo: 'Documentos', href: '/recursos/documentos/', descricao: 'Estatutos, regulamentos, formulários', icone: 'documento' },
      { rotulo: 'Ligações úteis', href: '/recursos/ligacoes/', descricao: 'Sítios de referência', icone: 'externo' },
      { rotulo: 'Perguntas frequentes', href: '/recursos/faq/', descricao: 'Dúvidas mais comuns', icone: 'info' },
    ],
  },
  { rotulo: 'Contactos', href: '/contactos/' },
];

/** Verdadeiro quando o item corresponde ao caminho atual (ou é seu ascendente). */
export function estaAtivo(href: string, caminho: string): boolean {
  const n = (s: string) => (s.endsWith('/') ? s : s + '/');
  if (href === '/') return n(caminho) === '/';
  return n(caminho) === n(href) || n(caminho).startsWith(n(href));
}
