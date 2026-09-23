/**
 * Duplo de `astro:content` para os testes unitários.
 *
 * `src/lib/conteudo.ts` importa o módulo virtual do Astro, que só existe
 * durante o build. As funções testadas aqui — `slugCategoria()`,
 * `relacionados()` — são puras e nunca chamam `getCollection()`; este duplo
 * existe apenas para o módulo poder ser importado.
 */
export type CollectionEntry<_T extends string> = {
  id: string;
  data: Record<string, unknown>;
};

export async function getCollection(): Promise<never[]> {
  throw new Error(
    'getCollection() não está disponível nos testes unitários: só a lógica pura é testada aqui.',
  );
}

export async function render(): Promise<never> {
  throw new Error('render() não está disponível nos testes unitários.');
}
