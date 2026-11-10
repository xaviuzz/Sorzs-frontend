import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import { SorzEntry } from "@/domain/SorzEntry";

export class AddSorz {
	constructor(private readonly client: Client<paths>) {}

	async run(address: string, name: string): Promise<SorzEntry> {
		const answer = await this.client.POST("/sorzs.add", {
			body: { header: CallId.next().header(), body: { address, name } },
		});
		const body = Refusable.of(answer).success();
		return new SorzEntry(body);
	}
}
