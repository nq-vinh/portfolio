export function encodeEntities(s: string): string {
	let result = '';
	for (let i = 0; i < s.length; i++) {
		const code = s.charCodeAt(i);
		result += i % 2 === 0 ? `&#${code};` : `&#x${code.toString(16)};`;
	}
	return result;
}

export function obfuscatedMailto(email: string): string {
	return encodeEntities(`mailto:${email}`);
}

export function obfuscatedEmailHtml(email: string): string {
	const [localPart, domain] = email.split('@');
	return `${encodeEntities(localPart)}<span class="ns">.nospam</span>${encodeEntities('@' + domain)}`;
}
