// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://nqvinh.tech',
	build: {
		inlineStylesheets: 'always',
	},
	compressHTML: true,
});
