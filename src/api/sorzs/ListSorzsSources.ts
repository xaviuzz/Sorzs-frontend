import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import { SorzsSourceEntry } from "@/domain/SorzsSourceEntry";

export class ListSorzsSources {
	constructor(private readonly client: Client<paths>) {}

	async run(): Promise<SorzsSourceEntry[]> {
		const answer = await this.client.POST("/sorzs.sources", {
			body: { header: CallId.next().header() },
		});
		const body = Refusable.of(answer).success();
		const entries: SorzsSourceEntry[] = [];
		for (const data of body.sources) {
			entries.push(new SorzsSourceEntry(data));
		}
		return entries;
	}
}
