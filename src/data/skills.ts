export interface SkillGroup {
	label: string;
	skills: readonly string[];
}

export const skillGroups = [
	{
		label: 'Frontend development',
		skills: [
			'React.js',
			'TypeScript',
			'JavaScript',
			'HTML',
			'CSS',
			'Custom properties',
			'Fluid layout',
			'Container queries',
			'SCSS',
			'Angular',
			'Vue.js',
			'Astro',
		],
	},
	{
		label: 'Design systems and accessibility',
		skills: ['Component libraries', 'Design tokens', 'WCAG AA', 'axe', 'Keyboard and screen-reader testing'],
	},
	{
		label: 'Performance and state',
		skills: ['Core Web Vitals', 'Lighthouse', 'Web Workers', 'Canvas and SVG', 'D3.js', 'RxJS', 'NgRx'],
	},
	{
		label: 'Testing and tooling',
		skills: [
			'Playwright',
			'Vitest',
			'Jest',
			'Vite',
			'webpack',
			'GitHub Actions',
			'GitLab CI',
			'Docker',
			'Azure Static Web Apps',
			'Claude Code',
		],
	},
	{
		label: 'E-commerce and backend',
		skills: ['Shopware 5 and 6', 'PHP', 'Symfony', 'MySQL', 'Elasticsearch', 'Redis'],
	},
	{
		label: 'Spoken languages',
		skills: ['English (C1)', 'Vietnamese (native)'],
	},
] as const satisfies readonly SkillGroup[];
