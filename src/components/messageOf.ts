export function messageOf(error: unknown, fallback: string): string {
	let message = fallback;
	if (error instanceof Error) {
		message = error.message;
	}
	return message;
}
