export interface SkillGroup {
	label: string;
	skills: readonly string[];
}

export const skillGroups = [
	{
		label: 'Frontend development',
		skills: [
			'TypeScript',
			'JavaScript',
			'HTML',
			'SCSS/CSS',
			'Angular',
			'Vue.js',
			'React',
			'RxJS',
			'NgRx',
			'Redux',
			'Bootstrap',
			'Material UI',
			'Tailwind CSS',
			'accessibility (WCAG)',
		],
	},
	{
		label: 'E-commerce & backend',
		skills: [
			'Shopware 5 & 6',
			'Twig',
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
			'Jest',
			'Cypress',
			'webpack',
			'Vite',
			'Docker/ddev',
			'GitLab CI',
			'Git',
			'Claude Code',
			'Codex CLI',
		],
	},
	{
		label: 'Data visualization',
		skills: ['D3.js', 'Chart.js', 'Plotly', 'Matplotlib'],
	},
	{
		label: 'Spoken languages',
		skills: ['English (C1)', 'Vietnamese (native)'],
	},
] as const satisfies readonly SkillGroup[];
