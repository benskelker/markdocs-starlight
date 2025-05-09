// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import markdoc from '@astrojs/markdoc';
import starlightNextjsTheme from 'starlight-nextjs-theme';
import starlightUtils from "@lorenzo_lewis/starlight-utils";
import { toc } from './data/toc.mjs';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi'
import path from 'node:path';

// https://astro.build/config
export default defineConfig({
  integrations: [
    markdoc(),
    starlight({
      plugins: [
        starlightOpenAPI([
          {
            base: 'apis/workspace-ops',
            schema: './src/content/docs/apis/workspace-ops.yaml'
          },
        ]),
        starlightNextjsTheme(),
        starlightUtils({
          multiSidebar: {
            switcherStyle: "hidden"
          },
        }),
      ],
      title: 'CyberArk',
      sidebar: [
        ...openAPISidebarGroups,
        ...toc
      ]
    }),
    {
      name: 'file-watcher-reloader',
      hooks: {
        'astro:config:setup': ({ addWatchFile }) => {
          addWatchFile(new URL('./data/toc.mjs', import.meta.url));
        },
      },
    },
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
  site: 'https://benskelker.github.io',
  base: '/markdocs-starlight',
  output: 'static',
});