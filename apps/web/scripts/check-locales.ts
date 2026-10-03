// Checks that every locale has the same keys as the Ukrainian source
// (plural suffixes like _one/_few/_many/_other are compared by base key).
import uk from '../src/i18n/locales/uk';
import en from '../src/i18n/locales/en';

const PLURAL = /_(zero|one|two|few|many|other)$/;

function keys(obj: unknown, prefix = ''): Set<string> {
  const out = new Set<string>();
  if (Array.isArray(obj)) {
    out.add(`${prefix}[${obj.length}]`);
    obj.forEach((v, i) => keys(v, `${prefix}[${i}]`).forEach((k) => out.add(k)));
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      keys(v, prefix ? `${prefix}.${k.replace(PLURAL, '')}` : k.replace(PLURAL, '')).forEach((x) => out.add(x));
    }
  } else {
    out.add(prefix);
  }
  return out;
}

const source = keys(uk);
let failed = false;
for (const [name, locale] of Object.entries({ en })) {
  const target = keys(locale);
  const missing = [...source].filter((k) => !target.has(k));
  const extra = [...target].filter((k) => !source.has(k));
  if (missing.length || extra.length) {
    failed = true;
    console.error(`${name}: missing ${JSON.stringify(missing)}, extra ${JSON.stringify(extra)}`);
  }
}
if (failed) process.exit(1);
console.log('Locales are in sync.');
