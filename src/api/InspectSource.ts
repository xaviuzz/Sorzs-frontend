import type { Client } from "openapi-fetch";
import { CallRefusedError } from "@/api/CallRefusedError";
import type { paths } from "@/api/schema";

export type PageInfo = {
	title: string | null;
	favicon: string | null;
};

export class InspectSource {
	constructor(private readonly client: Client<paths>) {}

	async run(address: string): Promise<PageInfo> {
		const callId = crypto.randomUUID();
		const answer = await this.client.POST("/sources.inspect", {
			body: { header: { callId }, body: { address } },
		});
		if (answer.error) {
			throw new CallRefusedError(answer.error);
		}
		const body = answer.data.body;
		if ("code" in body) {
			throw new CallRefusedError(body);
		}
		return body;
	}
}
