/**
 * Gera as capturas de ecrã usadas na revisão visual e na documentação.
 *
 * A lógica está em scripts/lib/capturas.mjs, partilhada com `npm run qa
 * -- --capturas` para não haver duas implementações a divergir (DT-007).
 *
 * Uso: node scripts/capturas.mjs [--url http://localhost:4321] [--so <nome>]
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { capturar, SAIDA } from './lib/capturas.mjs';

const arg = (nome, predefinicao = null) =>
  process.argv.includes(nome) ? process.argv[process.argv.indexOf(nome) + 1] : predefinicao;

const base = arg('--url', 'http://localhost:4321');
const so = arg('--so');

await mkdir(SAIDA, { recursive: true });

// O ambiente traz o Chromium pré-instalado; CHROMIUM_PATH aponta para outro
// binário quando for preciso. Sem nenhum, o Playwright procura o que instalou.
const CHROMIUM = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {});

const n = await capturar(navegador, { base, so });
await navegador.close();

console.log(`${n} capturas em ${SAIDA}/`);
