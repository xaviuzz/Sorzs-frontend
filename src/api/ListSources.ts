import type { Client } from "openapi-fetch";
import { CallRefusedError } from "@/api/CallRefusedError";
import type { paths } from "@/api/schema";
import type { SourceEntry } from "@/domain/SourceEntry";

export class ListSources {
	constructor(private readonly client: Client<paths>) {}

	async run(): Promise<SourceEntry[]> {
		const callId = crypto.randomUUID();
		const answer = await this.client.POST("/sources.list", {
			body: { header: { callId } },
		});
		if (answer.error) {
			throw new CallRefusedError(answer.error);
		}
		const body = answer.data.body;
		if ("code" in body) {
			throw new CallRefusedError(body);
		}
		return body.sources;
	}
}
