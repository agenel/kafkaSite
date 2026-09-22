// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kafkasanatakademisi.com',
  trailingSlash: 'never',
  integrations: [
    mdx(),
    // Yasal yer tutucular noindex; site haritasında da yer almamalı.
    sitemap({ filter: (sayfa) => !sayfa.includes('/yasal/') }),
  ],
  vite: { plugins: [tailwindcss()] },
});
