import type { ReactNode } from "react";
import type { SearchReading } from "@/components/search/reading/SearchReading";
import { SearchResultItem } from "@/components/search/SearchResultItem";
import { SorzDidNotAnswer } from "@/components/search/SorzDidNotAnswer";
import type { SearchAnswer } from "@/domain/SearchAnswer";

export class FoundResults implements SearchReading {
	constructor(private readonly answer: SearchAnswer) {}

	view(): ReactNode {
		return (
			<ul className="flex max-w-results flex-col gap-1">
				{this.answer.results.map((result) => (
					<SearchResultItem key={result.url} result={result} />
				))}
				{this.answer.failed.map((sorz) => (
					<SorzDidNotAnswer key={sorz} sorz={sorz} />
				))}
			</ul>
		);
	}
}
