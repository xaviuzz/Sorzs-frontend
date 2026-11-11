import type { SearchProvider } from "@/domain/SearchProvider";

export class RedditProvider implements SearchProvider {
	isSpecific(): boolean {
		return true;
	}

	hint(): string {
		return "Searched by Reddit";
	}
}
