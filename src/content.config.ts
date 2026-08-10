import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			metaTitle: z.string().optional(),
			/** One line under the title. Doubles as the meta description and the card copy. */
			summary: z.string(),
			/** Doubles as the stack chips; there is no separate stack field to keep in sync. */
			tags: z.array(z.string()).min(1),
			date: z.coerce.date(),
			featured: z.boolean().default(false),
			draft: z.boolean().default(false),
			repo: z.string().url().optional(),
			live: z.string().url().optional(),

			/**
			 * Lead image for the card, the per-page OG card, and the first gallery
			 * figure on the case study - so it carries a caption like every other
			 * figure does.
			 * Optional only until every project has one; tighten to required after that.
			 */
			cover: z
				.object({
					src: image(),
					alt: z.string(),
					caption: z.string(),
				})
				.optional(),
			gallery: z
				.array(
					z.object({
						src: image(),
						alt: z.string(),
						caption: z.string(),
					}),
				)
				.default([]),

			stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
			hooks: z
				.array(
					z.object({
						id: z.string(),
						misconception: z.string(),
						question: z.string(),
						metric: z.string(),
						detail: z.string(),
					}),
				)
				.default([]),
		}),
});

export const collections = { projects };
