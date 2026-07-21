export interface SkillGroup {
	label: string;
	skills: readonly string[];
}

export const skillGroups = [
	{
		label: 'Frontend development',
		skills: [
			'TypeScript/JavaScript',
			'HTML',
			'SCSS/CSS',
			'Angular (Signals, zoneless, standalone)',
			'Vue.js',
			'Astro',
			'RxJS',
			'NgRx (Store & signalStore)',
			'accessibility (WCAG AA, axe)',
			'web performance (Core Web Vitals, Lighthouse)',
		],
	},
	{
		label: 'E-commerce & backend',
		skills: [
			'Shopware 5 & 6 (Twig themes, storefront plugins, Admin/Store API, CMS)',
			'PHP',
			'Symfony',
			'MySQL',
			'Elasticsearch',
			'Redis',
		],
	},
	{
		label: 'Tooling & testing',
		skills: [
			'Playwright',
			'Vitest',
			'Jest',
			'Vite',
			'webpack',
			'Docker/ddev',
			'GitHub Actions',
			'GitLab CI',
			'Azure Static Web Apps',
			'Git',
			'AI-assisted development (Claude Code, Codex CLI, agentic workflows)',
		],
	},
	{
		label: 'Data visualization',
		skills: ['D3.js', 'Canvas & SVG rendering', 'Chart.js'],
	},
	{
		label: 'Spoken languages',
		skills: ['English (C1)', 'Vietnamese (native)'],
	},
] as const satisfies readonly SkillGroup[];
