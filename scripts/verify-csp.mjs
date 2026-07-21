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
const bodySizes = new Map();
for (const file of htmlFiles) {
	const html = readFileSync(join(root, 'dist', file), 'utf8');
	for (const [, attrs = '', body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
		if (/\bsrc\s*=/.test(attrs) || /\btype\s*=\s*"application\/ld\+json"/.test(attrs)) continue;
		const hash = `sha256-${createHash('sha256').update(body).digest('base64')}`;
		if (!required.has(hash)) {
			required.set(hash, file);
			bodySizes.set(hash, Buffer.byteLength(body, 'utf8'));
		}
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

// case studies quote the live CSP and inline-script byte sizes as verifiable claims; fail the build when that prose drifts from reality
const contentDir = join(root, 'src', 'content', 'projects');
const actualSizes = [...bodySizes.values()];
const drifted = [];
let checkedDocs = 0;
for (const file of readdirSync(contentDir).filter((name) => name.endsWith('.md'))) {
	const markdown = readFileSync(join(contentDir, file), 'utf8');
	const quotedCsps = [...markdown.matchAll(/```[^\n]*\n([\s\S]*?)```/g)]
		.map(([, block]) => block.trim())
		.filter((block) => block.includes('script-src'));
	if (quotedCsps.length === 0) continue;
	checkedDocs += 1;
	for (const block of quotedCsps) {
		if (block !== csp) drifted.push(`src/content/projects/${file} quotes a CSP that differs from staticwebapp.config.json.`);
	}
	for (const [, claim] of markdown.matchAll(/(\d+) bytes/g)) {
		if (!actualSizes.includes(Number(claim))) {
			drifted.push(
				`src/content/projects/${file} claims an inline script of ${claim} bytes; actual sizes are ${actualSizes.join(', ')}.`,
			);
		}
	}
}

if (drifted.length > 0) {
	for (const problem of drifted) console.error(`CSP check: ${problem}`);
	console.error(`Current CSP: ${csp}`);
	process.exit(1);
}

console.log(
	`CSP check: ${required.size} inline script hash(es) match script-src across ${htmlFiles.length} page(s); ${checkedDocs} case-study doc(s) quote the current CSP.`,
);
