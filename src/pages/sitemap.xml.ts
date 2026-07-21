import type { APIRoute } from 'astro';
import { getPublishedProjects } from '../lib/projects';

export const GET: APIRoute = async ({ site }) => {
	if (!site) throw new Error('The sitemap requires `site` to be set in astro.config.mjs.');

	const projects = await getPublishedProjects();
	const staticPaths = Object.keys(import.meta.glob('./**/*.astro'))
		.filter((file) => !file.includes('[') && !file.includes('404'))
		.map((file) => file.slice(1).replace(/index\.astro$/, '').replace(/\.astro$/, '/'));
	const staticUrls = staticPaths.map((path) => `<url><loc>${new URL(path, site)}</loc></url>`);
	const projectUrls = projects.map(
		(project) =>
			`<url><loc>${new URL(`/projects/${project.id}/`, site)}</loc><lastmod>${project.data.date.toISOString()}</lastmod></url>`,
	);
	const body = [...staticUrls, ...projectUrls].join('');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
		{
			headers: {
				'Content-Type': 'application/xml',
			},
		},
	);
};
