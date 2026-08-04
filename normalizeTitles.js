const fs = require('fs');
const p = 'data/products.ts';
let s = fs.readFileSync(p,'utf8');
const small = new Set(['de','la','las','los','el','y','en','del','al','con','para','por','a','un','una','unos','unas','su','lo']);
function titleCaseExcept(str){
  if(!str) return str;
  const leadingMatch = str.match(/^[^A-Za-z0-9ÁÉÍÓÚáéíóúÜüÑñ]+/);
  const leading = leadingMatch ? leadingMatch[0] : '';
  let rest = leading ? str.slice(leading.length).trim() : str.trim();
  if(!rest) return str;
  const parts = rest.split(/\s+/);
  const transformed = parts.map((w, idx) => {
    const lower = w.toLowerCase();
    if(idx > 0 && small.has(lower)) return lower;
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
  return (leading + transformed).replace(/\s+/g,' ');
}
let count = 0;
s = s.replace(/title:\s*'([^']*)'/g, (m, t) => {
  const nt = titleCaseExcept(t);
  if(nt !== t){ count++; }
  return `title: '${nt}'`;
});
fs.writeFileSync(p, s, 'utf8');
console.log('titles updated:', count);
