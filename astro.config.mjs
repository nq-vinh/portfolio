// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://nqvinh.tech',
	trailingSlash: 'always',
	build: {
		inlineStylesheets: 'always',
	},
	markdown: {
		// tokens would only be recolored to plain text by the case-study styles, so skip highlighting and its inline style attributes entirely
		syntaxHighlight: false,
	},
	compressHTML: true,
});
