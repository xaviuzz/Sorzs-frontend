import type { Client } from "openapi-fetch";
import { CallRefusedError } from "@/api/CallRefusedError";
import type { paths } from "@/api/schema";
import { AddressCandidate } from "@/domain/AddressCandidate";

export type PageInfo = {
	title: string | null;
	favicon: string | null;
	candidates: AddressCandidate[];
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
		const candidates: AddressCandidate[] = [];
		for (const candidate of body.candidates) {
			candidates.push(new AddressCandidate(candidate));
		}
		return { title: body.title, favicon: body.favicon, candidates };
	}
}
