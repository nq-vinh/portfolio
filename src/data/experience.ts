export interface Experience {
	kind: 'experience';
	company: string;
	role: string;
	period: string;
	location: string;
	highlights: readonly string[];
}

export interface Education {
	kind: 'education';
	degree: string;
	institution: string;
	period?: string;
}

export const timeline = [
	{
		kind: 'experience',
		company: "Web'n'sale",
		role: 'Working Student, Frontend Development',
		period: 'Jun 2025 - Present',
		location: 'Germany',
		highlights: [
			'Migrating Douglas country-shop storefronts from Shopware 5 to Shopware 6 within a master/child theme architecture shared across shops.',
			'Building storefront features in Twig, SCSS, and JavaScript; maintaining Playwright end-to-end suites and GitLab CI pipelines.',
			'Supporting Symfony/PHP platform upgrades across the shop landscape.',
		],
	},
	{
		kind: 'education',
		degree: 'M.Sc. Computer Science',
		institution: 'Technische Universität Darmstadt',
		period: 'Apr 2025 - Present',
	},
	{
		kind: 'experience',
		company: '.NFQ',
		role: 'Frontend Engineer',
		period: 'Nov 2022 - Mar 2025',
		location: 'Vietnam',
		highlights: [
			'Developed Shopware 6 e-commerce features with Vue.js and Twig component architecture.',
			'Built product-recommendation and search experiences for high-traffic storefronts.',
		],
	},
	{
		kind: 'experience',
		company: 'ROSEN Group',
		role: 'Frontend Engineer',
		period: 'Jul 2019 - Jun 2022',
		location: 'Vietnam',
		highlights: [
			'Built Angular applications for pipeline-inspection sensor data used by inspection engineers.',
			'Developed real-time IoT dashboards handling 1000+ concurrent WebSocket connections with RxJS.',
			'Visualized sensor readings and ML model outputs with D3.js and Chart.js.',
			'Implemented state management with NgRx and OAuth 2.0 authentication flows.',
		],
	},
	{
		kind: 'education',
		degree: 'B.Sc. Computer Science',
		institution: 'Frankfurt University of Applied Sciences',
		period: 'Aug 2020',
	},
] as const satisfies readonly (Experience | Education)[];
