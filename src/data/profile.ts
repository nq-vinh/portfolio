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
		"I build frontend interfaces where performance, accessibility, and the browser's fundamentals do the heavy lifting.",
	introduction:
		"Six years of experience across Angular, Vue, and TypeScript. I've built real-time dashboards for industrial pipeline inspection, high-traffic e-commerce storefronts, and I care about the last 10%: performance budgets, accessibility. Currently pursuing an M.Sc. in Computer Science at TU Darmstadt.",
	metaDescription:
		'Senior frontend engineer in Darmstadt, Germany. Six years building Angular, Vue, and TypeScript applications - from real-time IoT dashboards to large-scale e-commerce storefronts.',
	now: [
		"Senior Frontend Developer (Part-time) @ Web'n'sale.",
		'M.Sc. Computer Science @ TU Darmstadt.',
		'Darmstadt, Germany - open to senior frontend roles in the Rhein-Main area or remote.',
	],
	socialLinks: [
		{ label: 'GitHub', href: 'https://github.com/nq-vinh', icon: 'github' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinh1911/', icon: 'linkedin' },
	],
} as const satisfies Profile;

export const personId = new URL('/#person', import.meta.env.SITE).href;
