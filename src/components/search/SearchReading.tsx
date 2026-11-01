import type { ReactNode } from "react";
import { SearchResultItem } from "@/components/search/SearchResultItem";
import { messageOf } from "@/components/sources/messageOf";
import type { SearchResult } from "@/domain/SearchResult";

export interface SearchReading {
	view(): ReactNode;
}

export class NoSearchYet implements SearchReading {
	view(): ReactNode {
		return null;
	}
}

export class Searching implements SearchReading {
	view(): ReactNode {
		return <p role="status">Searching</p>;
	}
}

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

export class FailedSearch implements SearchReading {
	constructor(private readonly message: string) {}

	static from(error: unknown): FailedSearch {
		const message = messageOf(error, "The search failed");
		return new FailedSearch(message);
	}

	view(): ReactNode {
		return (
			<p role="alert" className="text-error">
				{this.message}
			</p>
		);
	}
}
