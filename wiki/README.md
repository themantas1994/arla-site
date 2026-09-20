# Fonte da Wiki

Este diretório contém a Wiki técnica do sítio da ARLA, escrita em Markdown e em **português
de Portugal**, seguindo a convenção de nomes de página da Wiki do GitHub (`Nome-Da-Pagina.md`),
para que possa ser copiada tal como está para a Wiki deste repositório
(`https://github.com/themantas1994/arla-site.wiki.git`), quando houver acesso de edição:

```bash
git clone https://github.com/themantas1994/arla-site.wiki.git
cp wiki/*.md arla-site.wiki/
cd arla-site.wiki && git add -A && git commit -m "Importar wiki técnica" && git push
```

**Nota sobre as ligações internas.** As páginas ligam entre si por nome de ficheiro com
extensão (`[Arquitetura](Arquitetura.md)`), o que funciona tanto a navegar neste diretório
no GitHub como depois de copiadas para a Wiki. Se a Wiki do GitHub vier a ser usada como
fonte principal, mantenha-a sincronizada com este diretório — a duplicação silenciosa entre
as duas é a forma mais fácil de a documentação voltar a divergir do código.

Comece em [`Home.md`](Home.md).

A documentação dirigida à direção da associação — edição de conteúdos, implantação, razões
das decisões de arquitetura e resultados de qualidade — está em [`docs/`](../docs), na raiz
do repositório.
