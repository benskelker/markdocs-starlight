import { defineMarkdocConfig } from '@astrojs/markdoc/config';
import starlightMarkdoc from '@astrojs/starlight-markdoc';
import { productVars } from './data/vars.mjs'

// https://docs.astro.build/en/guides/integrations-guide/markdoc/
export default defineMarkdocConfig({
	extends: [starlightMarkdoc()],
	variables: productVars
});
