# Wiki técnica — Sítio da ARLA

A **ARLA — Associação de Radioamadores do Litoral Alentejano** é uma associação portuguesa
sem fins lucrativos, com o indicativo coletivo **CS5ARLA**, sediada em Santiago do Cacém.
Este repositório contém o código-fonte do seu sítio público,
[www.cs5arla.pt](https://www.cs5arla.pt): uma reconstrução completa de um sítio WordPress
anterior, sob a forma de um sítio estático em [Astro](https://astro.build), com o conteúdo
guardado em Git.

Esta Wiki é a **referência técnica aprofundada** para quem desenvolve: arquitetura, modelo
de conteúdos e de dados, convenções dos componentes, implantação, qualidade e resolução de
problemas. Não repete o [README](../README.md) — comece por lá para a visão geral, a pilha
tecnológica e os comandos.

O diretório [`docs/`](../docs) contém documentação dirigida à direção da associação e a quem
mantém o projeto: o *porquê* das decisões de arquitetura, a auditoria da migração de
conteúdos, o guia de edição para os membros da direção e os resultados de qualidade
registados. Esta Wiki liga-lhe em vez de o duplicar.

---

## Percurso de leitura recomendado

1. **[Arquitetura](Arquitetura.md)** — como o sítio está construído e porquê.
2. **[Estrutura do Projeto](Estrutura-do-Projeto.md)** — o que cada diretório e ficheiro faz.
3. **[Desenvolvimento Local](Desenvolvimento-Local.md)** — pôr o ambiente a funcionar.
4. **[Coleções de Conteúdo](Colecoes-de-Conteudo.md)** e
   **[Sistema de Repetidores](Sistema-de-Repetidores.md)** — o modelo de dados, a fundo.
5. **[Notícias e Artigos](Noticias-e-Artigos.md)** e **[Eventos](Eventos.md)** — o ciclo de
   vida do conteúdo editorial.
6. **[Componentes](Componentes.md)** e **[Sistema de Design](Sistema-de-Design.md)** — a
   camada de apresentação.
7. **[Rotas](Rotas.md)** — a tabela completa de rotas.
8. **[SEO](SEO.md)**, **[Acessibilidade](Acessibilidade.md)**,
   **[Desempenho](Desempenho.md)** — qualidade transversal.
9. **[Testes e Qualidade](Testes-e-Qualidade.md)**, **[Implantação](Implantacao.md)**,
   **[CI/CD](CI-CD.md)** — publicar alterações.
10. **[Segurança](Seguranca.md)**, **[Resolução de Problemas](Resolucao-de-Problemas.md)**,
    **[Contribuir](Contribuir.md)** — material de referência.

---

## O que este projeto é (e o que não é)

- **É** um sítio estático: cada página é gerada uma vez, no build, a partir de ficheiros
  Markdown e JSON deste repositório Git. Não há base de dados nem código a correr no
  servidor em produção.
- **É** gerido por conteúdos: a direção edita notícias, eventos e dados técnicos
  (repetidores, balizas, órgãos sociais) através do [Decap CMS](https://decapcms.org) em
  `/admin/`, que faz commit diretamente neste repositório por OAuth do GitHub.
- **Não é** feito com React, Vue ou qualquer framework de cliente. O Astro não envia
  JavaScript por predefinição, e os poucos elementos interativos (mapa, filtros de
  repetidores, alternância de tema, pesquisa) são blocos `<script>` pequenos e sem framework.
- **Não está** internacionalizado. Todo o conteúdo e todos os textos de interface estão em
  `pt-PT`; a arquitetura deixa caminho aberto para um segundo idioma
  (ver [Arquitetura](Arquitetura.md#evolução-futura)), mas nada está implementado.
- **Não tem** pipeline de CI/CD (não existe `.github/`) nem suite de testes unitários. A
  verificação é feita por guiões Node.js/Playwright, executados manualmente. Ver
  [CI/CD](CI-CD.md) e [Testes e Qualidade](Testes-e-Qualidade.md).

---

## Estado da documentação

A última auditoria ao repositório está registada em
[`docs/auditoria-do-projeto.md`](../docs/auditoria-do-projeto.md), com a lista do que foi
verificado, o que estava errado na documentação anterior e o que continua por resolver.

Convenção usada em todas as páginas desta Wiki para classificar funcionalidades:

| Etiqueta | Significado |
| --- | --- |
| **IMPLEMENTADO** | Existe no código e foi verificado nesta auditoria |
| **PARCIALMENTE IMPLEMENTADO** | Existe, mas incompleto ou dependente de configuração externa |
| **NÃO IMPLEMENTADO** | Documentado ou discutido, mas ausente do repositório |
| **PROPOSTA / FUTURO** | Melhoria possível, sem qualquer trabalho feito |
