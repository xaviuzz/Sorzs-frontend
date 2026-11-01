import type { Client } from "openapi-fetch";
import { CallRefusedError } from "@/api/CallRefusedError";
import type { paths } from "@/api/schema";
import { SearchResult } from "@/domain/SearchResult";

export class SearchSources {
	constructor(private readonly client: Client<paths>) {}

	async run(query: string): Promise<SearchResult[]> {
		const callId = crypto.randomUUID();
		const answer = await this.client.POST("/sources.search", {
			body: { header: { callId }, body: { query } },
		});
		if (answer.error) {
			throw new CallRefusedError(answer.error);
		}
		const body = answer.data.body;
		if ("code" in body) {
			throw new CallRefusedError(body);
		}
		const results: SearchResult[] = [];
		for (const data of body.results) {
			results.push(new SearchResult(data));
		}
		return results;
	}
}
