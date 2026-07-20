// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://example.com', // TODO: real domain
	build: {
		inlineStylesheets: 'always',
	},
	compressHTML: true,
});
