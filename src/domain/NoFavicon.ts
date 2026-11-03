import type { Favicon } from "@/domain/Favicon";

export class NoFavicon implements Favicon {
	address(): string {
		return "";
	}

	isPresent(): boolean {
		return false;
	}
}
