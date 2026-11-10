import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import { CensusEntry } from "@/domain/CensusEntry";

export class ListCensus {
	constructor(private readonly client: Client<paths>) {}

	async run(): Promise<CensusEntry[]> {
		const answer = await this.client.POST("/sorzs.census", {
			body: { header: CallId.next().header() },
		});
		const body = Refusable.of(answer).success();
		const entries: CensusEntry[] = [];
		for (const data of body.sorzs) {
			entries.push(new CensusEntry(data));
		}
		return entries;
	}
}
