import type { ReactNode } from "react";
import type { SearchReading } from "@/components/search/reading/SearchReading";
import { SearchResultItem } from "@/components/search/SearchResultItem";
import type { SearchResult } from "@/domain/SearchResult";

export class FoundResults implements SearchReading {
	constructor(private readonly results: SearchResult[]) {}

	view(): ReactNode {
		return (
			<ul className="flex flex-col gap-4">
				{this.results.map((result) => (
					<SearchResultItem key={result.url} result={result} />
				))}
			</ul>
		);
	}
}
