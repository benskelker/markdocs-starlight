#!/usr/bin/env node
/*  Generate compiledSchema/markdoc.schema.js
    ───────────────────────────────────────── */


import { mkdir, writeFile }   from 'node:fs/promises';
import { dirname, resolve }   from 'node:path';
import schema                 from '../markdoc.config.mjs';   // ← executes starlightMarkdoc()

const outFile = resolve(process.cwd(), 'compiledSchema/markdoc.schema.js');

await mkdir(dirname(outFile), { recursive: true });
await writeFile(
    outFile,
    `// AUTO-GENERATED — do not edit.
module.exports = ${JSON.stringify(schema, null, 2)};\n`
);

console.log('✅ Markdoc schema written to', outFile);
    