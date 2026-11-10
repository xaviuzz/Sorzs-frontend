import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import { SorzEntry } from "@/domain/SorzEntry";

export class ListSorzs {
	constructor(private readonly client: Client<paths>) {}

	async run(): Promise<SorzEntry[]> {
		const answer = await this.client.POST("/sorzs.list", {
			body: { header: CallId.next().header() },
		});
		const body = Refusable.of(answer).success();
		const entries: SorzEntry[] = [];
		for (const data of body.sorzs) {
			entries.push(new SorzEntry(data));
		}
		return entries;
	}
}
