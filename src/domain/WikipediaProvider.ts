import type { SearchProvider } from "@/domain/SearchProvider";

export class WikipediaProvider implements SearchProvider {
	isSpecific(): boolean {
		return true;
	}

	hint(): string {
		return "Searched by Wikipedia";
	}
}
