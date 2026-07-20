export interface SkillGroup {
	label: string;
	skills: readonly string[];
}

export const skillGroups = [
	{
		label: 'Languages & frameworks',
		skills: ['TypeScript', 'JavaScript', 'Angular', 'Vue.js', 'React', 'RxJS', 'NgRx'],
	},
	{
		label: 'Styling',
		skills: ['CSS', 'SCSS', 'responsive & fluid layout', 'accessibility (WCAG)'],
	},
	{
		label: 'Testing & tooling',
		skills: ['Playwright', 'Jest', 'Cypress', 'GitLab CI', 'Docker'],
	},
	{
		label: 'Platforms',
		skills: ['Shopware 6', 'Symfony/PHP', 'Node.js'],
	},
	{
		label: 'Spoken languages',
		skills: ['English (C1)', 'Vietnamese (native)'],
	},
] as const satisfies readonly SkillGroup[];
