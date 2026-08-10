import { getCollection } from 'astro:content';

/**
 * Published projects in presentation order: featured first, then newest first.
 * Every surface that lists projects reads this, so the homepage grid, the work
 * index, and the previous/next links on a case study never disagree.
 */
export async function getPublishedProjects() {
	const projects = await getCollection('projects', ({ data }) => !data.draft);

	return projects.sort((a, b) => {
		if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
		return b.data.date.getTime() - a.data.date.getTime();
	});
}
