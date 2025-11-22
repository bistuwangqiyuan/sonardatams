import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sonardatams.netlify.app',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'zh-CN',
        locales: {
          'zh-CN': 'zh-CN',
        },
      },
    }),
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  compressHTML: true,
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    optimizeDeps: {
      include: ['echarts', 'papaparse'],
    },
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
});
