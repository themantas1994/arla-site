import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const src = (p: string) => fileURLToPath(new URL(`./src/${p}`, import.meta.url));

/**
 * Os testes cobrem só a lógica pura de `src/lib/`. Nenhuma dessas funções
 * precisa do Astro em execução, mas `conteudo.ts` importa `astro:content` para
 * os tipos das coleções — daí o duplo abaixo, que devolve o mínimo necessário.
 */
export default defineConfig({
  resolve: {
    alias: {
      'astro:content': fileURLToPath(new URL('./tests/duplos/astro-content.ts', import.meta.url)),
      '@components': src('components'),
      '@layouts': src('layouts'),
      '@lib': src('lib'),
      '@data': src('data'),
      '@': src(''),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
