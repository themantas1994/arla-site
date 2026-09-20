# Contribuir

---

## Antes de começar

```bash
git clone https://github.com/themantas1994/arla-site.git
cd arla-site
nvm use        # Node 22, se usar nvm
npm install
npm run dev
```

Ver [Desenvolvimento Local](Desenvolvimento-Local.md).

---

## Branches e pull requests

- **Não há convenção de nomes imposta** no repositório.
- **Não existe uma branch `main`.** A branch predefinida é atualmente
  `claude/arla-website-redesign-vcemm3` — confirme com `git ls-remote --symref origin HEAD`
  antes de abrir um pull request. O `public/admin/config.yml` aponta para `main`, o que é
  uma incoerência registada em
  [`docs/auditoria-do-projeto.md`](../docs/auditoria-do-projeto.md#problemas-encontrados)
  (DOC-020) e ainda por decidir.
- Não há CI: **as verificações que não correr, ninguém corre**. Ver [CI/CD](CI-CD.md).

### Antes de abrir um pull request

```bash
npm run check
npm run build
npm run preview &
npm run lint:links
npm run qa          # para qualquer alteração de UI, conteúdo ou acessibilidade
```

Para alterações que toquem em SEO ou em desempenho, acrescente `npm run audit:seo` e
`npm run audit:desempenho`.

---

## Mensagens de commit

O histórico usa frases descritivas, no imperativo e em **português**:

```text
Redesenhar por completo o sítio da ARLA: Astro, CMS e migração de conteúdos
Limpar guião de QA inexistente e completar os comandos no README
```

O Decap CMS usa um prefixo próprio para as alterações de conteúdo
(`Conteúdo: atualizar noticias "…"`), configurado em `public/admin/config.yml` — o que
permite distinguir de imediato o que é conteúdo e o que é código no histórico.

Mantenha esse tom. Mensagens em inglês são aceitáveis em alterações puramente de código,
mas a consistência com o histórico vale mais.

---

## Estilo de código

Siga o que já está no ficheiro que está a editar:

- **Português** nos textos visíveis, nos nomes de props e nos campos do modelo de conteúdo
  (`titulo`, `resumo`, `estado`, `frequenciaTx`…). Esta escolha é deliberada: quem edita
  conteúdos lê estes nomes no CMS.
- **Um componente, um ficheiro**: marcação, estilos com âmbito e script juntos.
- **Tokens de design** em vez de valores fixos: `var(--accent)`, `var(--e-4)`,
  `var(--raio)`.
- **Sem frameworks de cliente.** Não acrescente React, Vue ou diretivas `client:*` — o
  projeto não usa nenhum, e a ausência de JavaScript é uma das suas características.
- **TypeScript estrito.** Sem `@ts-ignore` nem `any` onde um tipo real seja possível.
- Comentários onde expliquem o *porquê*; o *o quê* deve estar no código.

---

## Regras que não são de estilo

Estas estão codificadas no projeto e não devem ser contornadas sem discussão:

1. **Nenhum facto no código.** Frequências, nomes, datas, valores — tudo em
   `src/content/` ou `src/data/`.
2. **Estado nunca só por cor.** Símbolo e texto, sempre.
3. **Nenhuma posição mais precisa do que a fonte permite.** Os marcadores do mapa dizem
   quando são aproximados.
4. **Toda a informação de um mapa existe também em texto.**
5. **Nada de terceiros no caminho crítico.** Recursos externos são diferidos e têm
   alternativa.
6. **Conteúdo histórico não se apaga nem se reescreve** — marca-se com `historico: true`.
7. **A validação Zod não se contorna.** Se um campo obrigatório estorva, o problema é o
   esquema, não a validação.

---

## Alterações de conteúdo

Podem ser feitas por `/admin/` (quando o CMS estiver configurado em produção) ou por pull
request, editando diretamente os ficheiros Markdown e JSON. Ver
[Gestão de Conteúdos](Gestao-de-Conteudos.md).

**Não altere factos da associação** — frequências, indicativos, IBAN, valor da quota,
composição dos órgãos sociais, datas históricas — sem confirmação de alguém da direção. O
que está por confirmar está listado em
[`docs/carece-de-verificacao.md`](../docs/carece-de-verificacao.md).

---

## Alterações que exigem mais do que um ficheiro

| Se alterar… | Atualize também |
| --- | --- |
| Um esquema em `src/content.config.ts` | `public/admin/config.yml` |
| Um campo apresentado numa tabela de dados | A vista em cartões do mesmo ficheiro |
| O nome de um ficheiro de conteúdo publicado | `redirects.mjs`, `.htaccess`, `_redirects`, `docs/mapa-de-redirecoes.md` |
| Uma rota | `src/lib/navegacao.ts`, se for para aparecer no menu |
| Um token de design | Verifique os dois temas |
| Qualquer coisa que a documentação descreva | A página correspondente em `wiki/` ou `docs/` |

---

## Documentação

- **`docs/`** — português, para a direção da associação e para quem mantém o projeto: razões
  das decisões, guia de edição, implantação, resultados de qualidade, auditoria da migração.
- **`wiki/`** — português, referência técnica para quem desenvolve.
- **`README.md`** — entrada rápida; o detalhe fica na Wiki, para não haver duas versões da
  mesma explicação a divergir.

Ao documentar, distinga sempre o que está **implementado** do que é **proposta** — e use as
etiquetas em uso (`IMPLEMENTADO`, `PARCIALMENTE IMPLEMENTADO`, `NÃO IMPLEMENTADO`,
`PROPOSTA / FUTURO`). Descrever uma proposta como se já existisse é o erro que esta
documentação foi auditada precisamente para corrigir; ver
[`docs/auditoria-do-projeto.md`](../docs/auditoria-do-projeto.md).

Números (contagens de ficheiros, de redireções, de páginas) envelhecem depressa: escreva-os
apenas quando forem úteis e diga de onde vêm, para que a verificação seguinte seja simples.

---

## Licença

**Não existe ficheiro `LICENSE` neste repositório.** O código não está publicado sob
nenhuma licença de código aberto, e os textos, fotografias e documentos são propriedade da
ARLA e dos respetivos autores. Antes de reutilizar seja o que for fora deste projeto, fale
com a associação.
