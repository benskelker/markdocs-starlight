import fs from 'fs';
import path from 'path';
import Markdoc from '@markdoc/markdoc';
import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';
import starlightMarkdoc from '@astrojs/starlight-markdoc';
import { productVars } from './data/vars.mjs';


const variant =
  process.env.PUBLIC_DOCS_VARIANT ||
  (typeof import.meta.env !== 'undefined' && import.meta.env.PUBLIC_DOCS_VARIANT) ||
  'ent';

console.log('Resolved variant in markdoc.config.mjs:', variant);

const PARTIAL_FILENAME = '_sca_cv_overview.mdoc';
const PARTIAL_PATH = path.resolve('./src/content/docs/partials', PARTIAL_FILENAME);

// Read and parse the partial into a Markdoc AST
const partialSource = fs.readFileSync(PARTIAL_PATH, 'utf-8');
const sharedContentAst = Markdoc.parse(partialSource);

export default defineMarkdocConfig({
  extends: [starlightMarkdoc()],
  variables: {
    ...productVars,
    variant,
  },
  partials: {
    // Key must exactly match the 'file' reference in your .mdoc
    [PARTIAL_FILENAME]: sharedContentAst,
  },
  tags: {
    cardlink: {
      render: component('./src/components/CardLink.astro'),
      attributes: {
        href:  { type: String, required: true },
        title: { type: String, required: true },
        icon:  { type: String }, 
      },
    },
    sendfeedback: {
      render: component('./src/components/SendFeedback.astro'),
      selfClosing: true
    }
  },
});

// ORIGINAL CODE
// import { defineMarkdocConfig } from '@astrojs/markdoc/config';
// import starlightMarkdoc from '@astrojs/starlight-markdoc';
// import { productVars } from './data/vars.mjs'

// // https://docs.astro.build/en/guides/integrations-guide/markdoc/
// export default defineMarkdocConfig({
// 	extends: [starlightMarkdoc()],
// 	variables: productVars
// });