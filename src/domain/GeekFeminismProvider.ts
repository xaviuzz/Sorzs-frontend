import type { SearchProvider } from "@/domain/SearchProvider";

export class GeekFeminismProvider implements SearchProvider {
	isSpecific(): boolean {
		return true;
	}

	hint(): string {
		return "Searched by Geek Feminism";
	}
}
