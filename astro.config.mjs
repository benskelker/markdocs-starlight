// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import markdoc from '@astrojs/markdoc';
import starlightNextjsTheme from 'starlight-nextjs-theme';
import starlightUtils from "@lorenzo_lewis/starlight-utils";
import { tocEnt } from './data/toc-ent.mjs';
import { tocOss } from './data/toc-oss.mjs';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi'
import path from 'node:path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let mode = 'env';
const idx = process.argv.indexOf('--mode');
if (idx !== -1 && process.argv[idx + 1]) mode = process.argv[idx + 1];

dotenv.config({ path: path.join(__dirname, `.env.${mode}`) });

const variant = process.env.PUBLIC_DOCS_VARIANT || 'ent';
console.log('astro.config.mjs – resolved variant:', variant);

// https://astro.build/config
export default defineConfig({
  integrations: [
    markdoc(),
    starlight({
      components: {
        PageTitle: './src/components/PageTitleNoDup.astro',
        PageSidebar: './src/components/CustomOnThisPage.astro',
      },
      routeMiddleware: './src/routeData.ts',
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
        ...(variant === 'ent' ? tocEnt : []),
        ...(variant === 'oss' ? tocOss : []),
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
