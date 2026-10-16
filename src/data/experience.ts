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
		role: 'Senior Frontend Developer (Part-time)',
		period: 'Jun 2025 - Present',
		location: 'Germany',
		highlights: [
			'Lead the Shopware 5 to 6 storefront migration for three Douglas country shops: reusable master theme, country child themes, product pages rebuilt to pixel parity in Twig, SCSS, and JavaScript.',
			'Rebuilt faceted filtering, pagination, mega menu, and CMS landing pages as plugins together with backend and design colleagues.',
			'Maintain live shops end-to-end: responsive fixes across cart and checkout, catalog issues, hybrid mobile app debugging.',
			'Upgraded the agency plugin stack to Symfony 7.4, PHP 8.4, and Shopware 6.7; introduced Playwright end-to-end tests, linting, CI fixes, and AI-assisted development workflows.',
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
		role: 'Frontend Developer',
		period: 'Nov 2022 - Mar 2025',
		location: 'Vietnam',
		highlights: [
			'Built customer-facing features in React.js and TypeScript for high-traffic web shops, from design handoff to production release.',
			'Delivered product-recommendation and search experiences in a cross-functional team with product managers, designers, and backend engineers.',
			'Implemented responsive UI from design specifications with attention to detail across browsers and devices.',
		],
	},
	{
		kind: 'experience',
		company: 'ROSEN Group',
		role: 'Frontend Developer',
		period: 'Jul 2019 - Jun 2022',
		location: 'Vietnam',
		highlights: [
			'Scaffolded the shared UI component library that standardised look and feel across all platform applications.',
			'Built real-time IoT dashboards for complex sensor data with WebSockets, RxJS, and NgRx; resolved performance issues in big-data, map, and chart features.',
			'Built Asset Explorer (asset-network visualisation) and PORTAL (third-party integration platform) in Angular.',
			'Worked daily with German and international teams; integrated OAuth 2.0 authentication.',
		],
	},
	{
		kind: 'education',
		degree: 'B.Sc. Computer Science',
		institution: 'Frankfurt University of Applied Sciences',
		period: 'Aug 2020',
	},
] as const satisfies readonly (Experience | Education)[];
