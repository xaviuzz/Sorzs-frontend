import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import { SearchResult } from "@/domain/SearchResult";

export class SearchSorzs {
	constructor(private readonly client: Client<paths>) {}

	async run(query: string): Promise<SearchResult[]> {
		const answer = await this.client.POST("/sorzs.search", {
			body: { header: CallId.next().header(), body: { query } },
		});
		const body = Refusable.of(answer).success();
		const results: SearchResult[] = [];
		for (const data of body.results) {
			results.push(new SearchResult(data));
		}
		return results;
	}
}
