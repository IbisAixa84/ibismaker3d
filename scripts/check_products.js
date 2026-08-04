const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../data/products.ts');
const txt = fs.readFileSync(file, 'utf8');
// Split into product blocks by top-level object separator: "\n  },\n"
const parts = txt.split('\n  },\n');
// The export header occupies the first part; find the part that starts with "  {\n    id:" or "  {\n"
let products = [];
for (let i = 1; i < parts.length; i++) {
  let part = parts[i];
  // Add back the closing braces removed by split for easier parsing
  if (i !== parts.length - 1) part = part + '\n  },\n';
  // Only consider parts that contain "id:" or "title:" to avoid trailing code
  if (!/\b(title|id)\s*:/i.test(part)) continue;
  products.push(part);
}
function hasField(p, name) {
  const re = new RegExp('\\b' + name + '\\s*:', 'i');
  return re.test(p);
}
function extractId(p) {
  const m = p.match(/\bid:\s*'([^']+)'/i);
  return m ? m[1] : null;
}
function extractTitle(p) {
  const m = p.match(/\btitle:\s*'([^']+)'/i);
  return m ? m[1] : null;
}
let missing = [];
products.forEach((p, idx) => {
  const id = extractId(p);
  const title = extractTitle(p) || `<unknown-${idx}>`;
  const miss = [];
  if (!id) miss.push('id');
  if (!hasField(p, 'price')) miss.push('price');
  if (!hasField(p, 'important')) miss.push('important');
  if (miss.length) missing.push({index: idx+1, id, title, missing: miss});
});
if (missing.length === 0) {
  console.log('OK: Todos los productos tienen id, price y important.');
  process.exit(0);
}
console.log('Productos con campos faltantes:');
missing.forEach(m => {
  console.log(`- #${m.index} | id=${m.id || '—'} | title=${m.title} | faltan: ${m.missing.join(', ')}`);
});
console.log('\nTotal: ' + missing.length + ' producto(s) con campos faltantes.');
process.exit(0);
