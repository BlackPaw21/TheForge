// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://blackpaw21.github.io',
  base: '/TheForge',
  output: 'static',
  integrations: [react()],
});
