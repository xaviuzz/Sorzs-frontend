import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import { SourceEntry } from "@/domain/SourceEntry";

export class ListSources {
	constructor(private readonly client: Client<paths>) {}

	async run(): Promise<SourceEntry[]> {
		const answer = await this.client.POST("/sources.list", {
			body: { header: CallId.next().header() },
		});
		const body = Refusable.of(answer).success();
		const entries: SourceEntry[] = [];
		for (const data of body.sources) {
			entries.push(new SourceEntry(data));
		}
		return entries;
	}
}
