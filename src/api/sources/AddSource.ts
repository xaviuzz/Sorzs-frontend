import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import { SourceEntry } from "@/domain/SourceEntry";

export class AddSource {
	constructor(private readonly client: Client<paths>) {}

	async run(address: string, name: string): Promise<SourceEntry> {
		const answer = await this.client.POST("/sources.add", {
			body: { header: CallId.next().header(), body: { address, name } },
		});
		const body = Refusable.of(answer).success();
		return new SourceEntry(body);
	}
}
