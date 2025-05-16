
import { mkdir, writeFile }   from 'node:fs/promises';
import { dirname, resolve }   from 'node:path';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';



// Resolve paths --------------------------------------------------------------
const __dirname   = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const configPath  = resolve(projectRoot, 'markdoc.config.mjs');
const outFile     = resolve(projectRoot, 'compiledSchema/markdoc.schema.mjs');

// Use ASTRO_MODE to pick the right .env file
const envFile = process.env.npm_config_mode
  ? `.env.${process.env.npm_config_mode}`
  : '.env.dev';

dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

console.log('Loaded variant from PUBLIC_DOCS_VARIANT in build script:', process.env.PUBLIC_DOCS_VARIANT);

// Load your full config (Starlight + everything) -----------------------------
const { default: raw } = await import(/* webpackIgnore: true */ configPath);

// Helper: shallow-merge helper for each key we care about --------------------
function mergeSection(base, extra, key) {
  if (!extra?.[key]) return;
  base[key] = { ...(base[key] ?? {}), ...extra[key] };
}

// ---------------------------------------------------------------------------
// 1· Clone the root object so we don’t mutate the original
// 2· If it has an `extends` array, merge each item into the clone
// 3· Delete `extends`
// ---------------------------------------------------------------------------
const schema = { ...raw };

if (Array.isArray(raw.extends)) {
  for (const ext of raw.extends) {
    for (const key of ['nodes', 'tags', 'functions', 'variables']) {
      mergeSection(schema, ext, key);
    }
  }
}

delete schema.extends; // <-- ✂️  remove the field entirely

// ---------------------------------------------------------------------------
// 4· Write the flattened schema as an ES module
// ---------------------------------------------------------------------------
await mkdir(dirname(outFile), { recursive: true });

const banner = '// AUTO-GENERATED — do not edit.\n';
const body   = `export default ${JSON.stringify(schema, null, 2)};\n`;

await writeFile(outFile, banner + body);

console.log(`Flat Markdoc schema written to ${outFile}`);

