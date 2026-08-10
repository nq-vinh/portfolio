import type { IconName } from '../components/Icon.astro';

export interface SocialLink {
	label: string;
	href: string;
	icon: IconName;
}

export interface Profile {
	name: string;
	shortName: string;
	role: string;
	email: string;
	location: {
		city: string;
		country: string;
	};
	tagline: string;
	introduction: string;
	metaDescription: string;
	now: readonly string[];
	socialLinks: readonly SocialLink[];
}

export const profile = {
	name: 'Vinh Nguyen',
	shortName: 'Vinh',
	role: 'Senior Frontend Engineer',
	email: 'contact@nqvinh.tech',
	location: {
		city: 'Darmstadt',
		country: 'DE',
	},
	tagline:
		'I build design systems and the production UI that ships from them - component APIs, design tokens, and interfaces where performance and accessibility are part of the contract.',
	introduction:
		"Six years across Angular, Vue, and TypeScript, most of it spent on the layer where design becomes code: shared component libraries, design tokens, and the interfaces built from them. I've shipped real-time dashboards rendering sensor data at 40 Hz and high-traffic e-commerce storefronts, and I care about the last 10% - performance budgets, contrast ratios, keyboard paths. Currently pursuing an M.Sc. in Computer Science at TU Darmstadt.",
	metaDescription:
		'Senior frontend engineer in Darmstadt, Germany. Six years building design systems and production UI in Angular, Vue, and TypeScript - from real-time dashboards to large-scale storefronts.',
	now: [
		"Senior Frontend Developer (Part-time) @ Web'n'sale.",
		'M.Sc. Computer Science @ TU Darmstadt.',
		'Darmstadt, Germany - 20 minutes from Frankfurt. Open to senior frontend roles on-site, hybrid, or remote.',
	],
	socialLinks: [
		{ label: 'GitHub', href: 'https://github.com/nq-vinh', icon: 'github' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinh1911/', icon: 'linkedin' },
	],
} as const satisfies Profile;

export const personId = new URL('/#person', import.meta.env.SITE).href;
