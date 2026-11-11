import type { SearchProvider } from "@/domain/SearchProvider";

export class GenericProvider implements SearchProvider {
	isSpecific(): boolean {
		return false;
	}

	hint(): string {
		return "";
	}
}
