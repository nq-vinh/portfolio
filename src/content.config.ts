import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		metaTitle: z.string().optional(),
		summary: z.string(),
		tags: z.array(z.string()).min(1),
		date: z.coerce.date(),
		featured: z.boolean().default(false),
		draft: z.boolean().default(false),
		repo: z.string().url().optional(),
		live: z.string().url().optional(),
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
