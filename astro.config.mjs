// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import markdoc from '@astrojs/markdoc';
import starlightNextjsTheme from 'starlight-nextjs-theme'
import { toc } from './data/toc.mjs'

// https://astro.build/config
export default defineConfig({
  integrations: [
      markdoc(),
      starlight({
          plugins: [starlightNextjsTheme()],
          title: 'CyberArk',

          social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
          sidebar: toc
      }),
	],
  site: 'https://benskelker.github.io',
  base: '/markdocs-starlight',
  output: 'static',
});