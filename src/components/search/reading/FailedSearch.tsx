import type { ReactNode } from "react";
import { messageOf } from "@/components/messageOf";
import type { SearchReading } from "@/components/search/reading/SearchReading";

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
