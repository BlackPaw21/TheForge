// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://blackpaw21.github.io',
  base: '/TheForge',
  integrations: [mdx()],
  output: 'static',
});
