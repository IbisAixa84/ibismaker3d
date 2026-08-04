export function formatTitle(input: string) {
  if (!input) return input;
  const small = new Set(['de','la','las','los','el','y','en','del','al','con','para','por','a','un','una','unos','unas','su','lo']);
  const leadingMatch = input.match(/^[^A-Za-z0-9ÁÉÍÓÚáéíóúÜüÑñ]+/);
  const leading = leadingMatch ? leadingMatch[0] : '';
  const rest = leading ? input.slice(leading.length).trim() : input.trim();
  if (!rest) return input;
  const parts = rest.split(/\s+/);
  const transformed = parts.map((w, idx) => {
    const lower = w.toLowerCase();
    if (idx > 0 && small.has(lower)) return lower;
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
  return (leading + transformed).replace(/\s+/g, ' ');
}
