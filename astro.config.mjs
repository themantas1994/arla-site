// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { redirects } from './src/lib/redirects.mjs';

// Canonical production origin. Override with PUBLIC_SITE_URL at build time.
const site = process.env.PUBLIC_SITE_URL || 'https://www.cs5arla.pt';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  redirects,
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'pt', locales: { pt: 'pt-PT' } },
      filter: (page) => !page.includes('/area-reservada/'),
    }),
  ],
  image: { responsiveStyles: true, layout: 'constrained' },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, wrap: true },
  },
  vite: { build: { cssTarget: ['chrome107', 'safari16', 'firefox110'] } },
});
