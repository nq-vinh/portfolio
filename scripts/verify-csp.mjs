import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const config = JSON.parse(readFileSync(join(root, 'staticwebapp.config.json'), 'utf8'));
const csp = config.globalHeaders['Content-Security-Policy'];
const scriptSrc = csp
	.split(';')
	.map((directive) => directive.trim())
	.find((directive) => directive.startsWith('script-src'));
const declared = new Set((scriptSrc?.match(/'sha256-[^']+'/g) ?? []).map((token) => token.slice(1, -1)));

const htmlFiles = readdirSync(join(root, 'dist'), { recursive: true })
	.map(String)
	.filter((file) => file.endsWith('.html'));

const required = new Map();
for (const file of htmlFiles) {
	const html = readFileSync(join(root, 'dist', file), 'utf8');
	for (const [, attrs = '', body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
		if (/\bsrc\s*=/.test(attrs) || /\btype\s*=\s*"application\/ld\+json"/.test(attrs)) continue;
		const hash = `sha256-${createHash('sha256').update(body).digest('base64')}`;
		if (!required.has(hash)) required.set(hash, file);
	}
}

const missing = [...required].filter(([hash]) => !declared.has(hash));
const stale = [...declared].filter((hash) => !required.has(hash));

if (missing.length > 0 || stale.length > 0) {
	for (const [hash, file] of missing) {
		console.error(`CSP check: inline script in dist/${file} has no matching hash in script-src: '${hash}'`);
	}
	for (const hash of stale) {
		console.error(`CSP check: script-src hash matches no inline script: '${hash}'`);
	}
	console.error('Update the script-src directive in staticwebapp.config.json with the hashes listed above.');
	process.exit(1);
}

console.log(`CSP check: ${required.size} inline script hash(es) match script-src across ${htmlFiles.length} page(s).`);
