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
		"Senior frontend engineer with 6+ years building customer-facing web applications across React, Angular, and Vue. Pure CSS and design-system work, from a shared UI component library to pixel-parity storefront rebuilds. I build frontend interfaces where performance, accessibility, and the browser's fundamentals do the heavy lifting. Completing an M.Sc. in Computer Science at TU Darmstadt.",
	metaDescription:
		'Senior frontend engineer in Darmstadt, Germany. Six years building React, Angular, and Vue applications - from a shared UI component library and real-time dashboards to high-traffic e-commerce storefronts.',
	now: [
		"Senior Frontend Developer (Part-time) @ Web'n'sale.",
		'M.Sc. Computer Science @ TU Darmstadt.',
		'Darmstadt, Germany.',
	],
	socialLinks: [
		{ label: 'GitHub', href: 'https://github.com/nq-vinh', icon: 'github' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinh1911/', icon: 'linkedin' },
	],
} as const satisfies Profile;

export const personId = new URL('/#person', import.meta.env.SITE).href;
