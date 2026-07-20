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
	introduction: string;
	metaDescription: string;
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
	introduction:
		"Six years of experience across Angular, Vue, and TypeScript. I've built real-time dashboards for industrial pipeline inspection, high-traffic e-commerce storefronts, and I care about the last 10%: performance budgets, accessibility. Currently pursuing an M.Sc. in Computer Science at TU Darmstadt.",
	metaDescription:
		'Senior frontend engineer in Darmstadt, Germany. Six years building Angular, Vue, and TypeScript applications - from real-time IoT dashboards to large-scale e-commerce storefronts.',
	socialLinks: [
		{ label: 'GitHub', href: 'https://github.com/nq-vinh', icon: 'github' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinh1911/', icon: 'linkedin' },
	],
} as const satisfies Profile;
