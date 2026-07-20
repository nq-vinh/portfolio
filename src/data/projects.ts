export interface Project {
	title: string;
	organization?: string;
	description: string;
	tags: readonly string[];
	href?: string;
}

export const projects: readonly Project[] = [
	{
		title: 'This website',
		description:
			'Zero-JavaScript by default Astro site: self-hosted Inter with a metric-matched fallback for zero layout shift, inlined critical CSS, WCAG AA+ in both themes, Lighthouse 100s. View source is the case study.',
		tags: ['Astro', 'TypeScript', 'CSS'],
		href: '#',
	},
];
