import type { Favicon } from "@/domain/Favicon";

export class FaviconAt implements Favicon {
	constructor(private readonly text: string) {}

	address(): string {
		return this.text;
	}

	isPresent(): boolean {
		return true;
	}
}
