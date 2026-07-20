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
			'Driving the Shopware 5 to 6 storefront migration for Douglas country shops (Portugal, Croatia, Slovenia): designed a reusable master theme with country-specific child themes and rebuilt product listing and detail pages in Twig, SCSS, and JavaScript to pixel parity with the legacy shops.',
			'Rebuilt complex storefront features - faceted filtering, pagination, mega menu, CMS landing pages - as Shopware 6 storefront plugins, and configured production CMS layouts via the Shopware Admin and Store API.',
			'Maintain live Shopware 5 shops end-to-end: responsive and mobile UI fixes across cart and checkout, media and catalog issues, and debugging of the Reskyt-based hybrid mobile app.',
			'Modernized an agency plugin stack: upgraded Symfony 6.4 to 7.4 and PHP 8.4, ported it to Shopware 6.7, and introduced Playwright end-to-end tests.',
			'Improved engineering hygiene across projects: JS/SCSS linting, GitLab CI pipeline fixes, ddev/Docker dev environments, and AI-assisted development workflows to accelerate migration work.',
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
			'Developed Shopware 6 e-commerce features with Vue.js and Twig component architecture.',
			'Built product-recommendation and search experiences for high-traffic storefronts.',
		],
	},
	{
		kind: 'experience',
		company: 'ROSEN Group',
		role: 'Frontend Developer',
		period: 'Jul 2019 - Jun 2022',
		location: 'Vietnam',
		highlights: [
			'Developed Angular web applications in close collaboration with German and international ROSEN teams.',
			'Created interactive dashboards for complex sensor data, implementing real-time IoT streaming and visualization with WebSockets and RxJS.',
			'Built Asset Explorer, visualizing customer asset networks through multiple visualization methods, and PORTAL, an external-facing platform enabling third-party applications to integrate with the platform infrastructure.',
			'Scaffolded a shared UI component library, standardizing look and feel across all applications on the platform.',
			'Implemented NgRx state management for complex data flows from multiple sources, and participated in integrating OAuth 2.0 authentication.',
			'Developed reusable Angular components for large datasets, optimized for mobile and desktop, and resolved performance issues in big-data, map, and chart features.',
		],
	},
	{
		kind: 'education',
		degree: 'B.Sc. Computer Science',
		institution: 'Frankfurt University of Applied Sciences',
		period: 'Aug 2020',
	},
] as const satisfies readonly (Experience | Education)[];
