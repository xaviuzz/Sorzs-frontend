import type { SearchResult } from "@/domain/SearchResult";

export class SearchAnswer {
	constructor(
		readonly results: SearchResult[],
		readonly failed: string[],
	) {}
}
