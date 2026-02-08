import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://hirenyx.com',
  integrations: [tailwind(), sitemap(), react()],
  output: 'static',
  adapter: vercel(),
});
