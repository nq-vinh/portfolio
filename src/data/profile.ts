export interface SocialLink {
	label: string;
	href: string;
}

export interface Profile {
	name: string;
	role: string;
	location: string;
	email: string;
	introduction: string;
	socialLinks: readonly SocialLink[];
}

export const profile = {
	name: 'Vinh Nguyen',
	role: 'Senior Frontend Engineer',
	location: 'Darmstadt, Germany',
	email: 'vinh1911.work@gmail.com',
	introduction:
		"Hi I'm Vinh - a senior frontend engineer with six years of experience across Angular, Vue, and TypeScript. I've built real-time dashboards for industrial pipeline inspection and high-traffic e-commerce storefronts, and I care about the last 10%: performance budgets, accessibility, and pixel-level polish. Currently pursuing an M.Sc. in Computer Science at TU Darmstadt.",
	socialLinks: [
		{ label: 'GitHub', href: '#' },
		{ label: 'LinkedIn', href: '#' },
	],
} as const satisfies Profile;
