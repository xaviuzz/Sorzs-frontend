import type { Client } from "openapi-fetch";
import { CallRefusedError } from "@/api/CallRefusedError";
import type { paths } from "@/api/schema";
import { SourceEntry } from "@/domain/SourceEntry";

export class AddSource {
	constructor(private readonly client: Client<paths>) {}

	async run(address: string, name: string): Promise<SourceEntry> {
		const callId = crypto.randomUUID();
		const answer = await this.client.POST("/sources.add", {
			body: { header: { callId }, body: { address, name } },
		});
		if (answer.error) {
			throw new CallRefusedError(answer.error);
		}
		const body = answer.data.body;
		if ("code" in body) {
			throw new CallRefusedError(body);
		}
		return new SourceEntry(body);
	}
}
