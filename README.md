# Sítio da ARLA — Associação de Radioamadores do Litoral Alentejano

Reconstrução completa do sítio [cs5arla.pt](https://www.cs5arla.pt/site/), de um
WordPress com tema *Septera* para um sítio estático moderno, rápido e acessível,
com gestão de conteúdos para a direção da associação.

Todo o conteúdo do sítio anterior foi migrado. Nenhum facto foi inventado: tudo o que
aparece como frequência, nome, indicativo, data, valor de quota ou dado bancário vem
do sítio original. O que não estava lá está explicitamente assinalado como pendente,
em [`docs/carece-de-verificacao.md`](docs/carece-de-verificacao.md).

---

## Índice da documentação

| Documento | Para que serve |
| --- | --- |
| [`docs/arquitetura.md`](docs/arquitetura.md) | Porquê Astro, como está organizado, decisões tomadas |
| [`docs/inventario-de-conteudos.md`](docs/inventario-de-conteudos.md) | Auditoria do sítio antigo, página a página |
| [`docs/mapa-de-redirecoes.md`](docs/mapa-de-redirecoes.md) | URL antigo → URL novo, para as 189 redireções |
| [`docs/gestao-de-conteudos.md`](docs/gestao-de-conteudos.md) | **Como a direção edita o sítio, sem programador** |
| [`docs/implantacao.md`](docs/implantacao.md) | Como pôr o sítio no ar |
| [`docs/carece-de-verificacao.md`](docs/carece-de-verificacao.md) | O que precisa de confirmação humana |
| [`docs/qualidade.md`](docs/qualidade.md) | Resultados de acessibilidade, desempenho, SEO e ligações |

---

## Arranque rápido

Requisitos: **Node.js 20.3 ou superior** (a versão usada está em `.nvmrc`).

```bash
npm install          # instalar dependências
npm run dev          # servidor de desenvolvimento em http://localhost:4321
npm run build        # build de produção para dist/ (inclui índice de pesquisa)
npm run preview      # servir o build de produção localmente
```

> **A pesquisa só funciona depois de `npm run build`.** O índice é gerado pelo
> Pagefind sobre o HTML final, por isso em `npm run dev` a página de pesquisa
> avisa que o índice ainda não existe. É o comportamento esperado.

### Todos os comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com recarregamento automático |
| `npm run build` | Build de produção + índice de pesquisa Pagefind |
| `npm run preview` | Serve `dist/` como em produção |
| `npm run check` | Verificação de tipos TypeScript em todo o projeto |
| `npm run lint:links` | Procura ligações partidas em `dist/` (`-- --externas` inclui as externas) |
| `npm run qa` | Acessibilidade, responsivo e testes funcionais num navegador real |
| `npm run qa:capturas` | O mesmo, gerando capturas de ecrã em `reports/capturas/` |

`npm run qa` precisa do build feito e de um servidor a correr:

```bash
npm run build
npm run preview &
npm run qa
```

---

## Estrutura do projeto

```
src/
  content/              Conteúdo editorial em Markdown
    noticias/           39 notícias e comunicados
    tecnica/            8 artigos técnicos
    eventos/            17 eventos e atividades
    paginas/            4 páginas de texto longo (A ARLA, o que é o radioamadorismo…)
  data/                 Dados estruturados em JSON, editáveis no CMS
    sitio.json          Morada, contactos, IBAN, quota, redes sociais
    repetidores.json    Um registo por repetidor
    balizas.json        Um registo por baliza
    orgaos-sociais.json Mesa da AG, Direção, Conselho Fiscal
    direcao-tecnica.json
    associados.json     Lista pública de associados
    cronologia.json     Historial da associação, entrada a entrada
    documentos.json     Biblioteca de documentos
    ligacoes.json       Ligações úteis
    faq.json            Perguntas frequentes
  components/           Componentes reutilizáveis (.astro)
  layouts/              Base, Pagina, Artigo
  pages/                Rotas do sítio
  lib/                  Funções auxiliares e mapa de redireções
  styles/global.css     Sistema de design completo
public/
  admin/                Decap CMS (config.yml + index.html)
  documentos/           PDF da associação
  imagens/conteudo/     Imagens e vídeos migrados do sítio antigo
  .htaccess             Redireções 301 e cabeçalhos (Apache)
  _redirects            Redireções 301 (Netlify / Cloudflare Pages)
docs/                   Documentação (ver índice acima)
scripts/                Ferramentas de QA e otimização de imagens
```

---

## Variáveis de ambiente

O sítio funciona sem qualquer variável de ambiente. Há uma única, opcional:

| Variável | Predefinição | Para que serve |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | `https://www.cs5arla.pt` | Origem canónica usada em `<link rel="canonical">`, Open Graph, sitemap e RSS. Defina-a se publicar noutro domínio ou num ambiente de pré-produção. |

```bash
PUBLIC_SITE_URL=https://pre-producao.exemplo.pt npm run build
```

**Não existem segredos no repositório.** Não há chaves de API, credenciais de base de
dados nem tokens. A autenticação do CMS é feita pelo GitHub, através de OAuth — ver
[`docs/implantacao.md`](docs/implantacao.md).

---

## Gestão de conteúdos

A direção da ARLA edita o sítio em `/admin/`, sem tocar em código: adicionar uma
notícia, mudar o estado de um repetidor, criar um evento, carregar um PDF ou atualizar
os órgãos sociais. Cada alteração fica registada no Git e o sítio é reconstruído
automaticamente.

Guia completo: [`docs/gestao-de-conteudos.md`](docs/gestao-de-conteudos.md).

---

## Licença e conteúdos

O código deste repositório destina-se ao sítio da ARLA. Os textos, fotografias e
documentos são propriedade da Associação de Radioamadores do Litoral Alentejano e dos
respetivos autores, identificados em cada artigo.
