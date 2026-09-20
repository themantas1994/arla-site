# Wiki source

This directory contains the developer Wiki for the ARLA website project, written in Markdown using GitHub's own wiki page-naming convention (`Page-Name.md`), so it can be copied as-is into this repository's GitHub Wiki (`https://github.com/themantas1994/arla.wiki.git`) if/when Wiki editing access is available:

```bash
git clone https://github.com/themantas1994/arla.wiki.git
cp wiki/*.md arla.wiki/
cd arla.wiki && git add -A && git commit -m "Import developer wiki" && git push
```

Until then, browse these files directly in this repository, starting at [`Home.md`](Home.md). Internal links use bare page names (GitHub Wiki's own link convention, e.g. `[Architecture](Architecture)`) — when browsing this folder directly on GitHub rather than as an actual Wiki, follow the corresponding `.md` file in this same directory.

This is developer-facing documentation, in English. For the association's own Portuguese-language, non-developer documentation (content editing, deployment, architecture rationale, QA results), see [`docs/`](../docs) at the repository root.
