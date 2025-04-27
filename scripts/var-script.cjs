const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

async function main() {
  const [,, filePath] = process.argv;
  if (!filePath) {
    console.error('Usage: flare vars to js_schema');
    process.exit(1);
  }

  const xml = fs.readFileSync(filePath, 'utf8');
  const parser = new xml2js.Parser({ explicitArray: false, trim: true });
  let result;
  try {
    result = await parser.parseStringPromise(xml);
  } catch (err) {
    console.error('Error parsing XML:', err);
    process.exit(1);
  }

  const vars = result.CatapultVariableSet.Variable;
  const fields = {};

  if (Array.isArray(vars)) {
    vars.forEach(v => {
      const name = v.$.Name;
      const value = v._ || v.EvaluatedDefinition || '';
      fields[name] = value;
    });
  } else if (vars && vars.$) {
    const name = vars.$.Name;
    const value = vars._ || vars.EvaluatedDefinition || '';
    fields[name] = value;
  }

  const objName = path.basename(filePath, path.extname(filePath));
  const schema = { [objName]: fields };

  // Output as JS module
  console.log('module.exports = ' + JSON.stringify(schema, null, 2) + ';');
}

main();
