export interface SocialLink {
	label: string;
	href: string;
}

export interface Profile {
	name: string;
	shortName: string;
	role: string;
	location: string;
	email: string;
	introduction: string;
	socialLinks: readonly SocialLink[];
}

export const profile = {
	name: 'Vinh Nguyen',
	shortName: 'Vinh',
	role: 'Senior Frontend Engineer',
	location: 'Darmstadt, Germany',
	email: 'vinh1911.work@gmail.com',
	introduction:
		"Six years of experience across Angular, Vue, and TypeScript. I've built real-time dashboards for industrial pipeline inspection, high-traffic e-commerce storefronts, and I care about the last 10%: performance budgets, accessibility. Currently pursuing an M.Sc. in Computer Science at TU Darmstadt.",
	socialLinks: [
		{ label: 'GitHub', href: 'https://github.com/nq-vinh' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinh1911/' },
	],
} as const satisfies Profile;
