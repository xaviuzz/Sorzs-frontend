import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import { AddressCandidate } from "@/domain/AddressCandidate";

export type PageInfo = {
	title: string | null;
	favicon: string | null;
	candidates: AddressCandidate[];
};

export class InspectSorz {
	constructor(private readonly client: Client<paths>) {}

	async run(address: string): Promise<PageInfo> {
		const answer = await this.client.POST("/sorzs.inspect", {
			body: { header: CallId.next().header(), body: { address } },
		});
		const body = Refusable.of(answer).success();
		const candidates: AddressCandidate[] = [];
		for (const candidate of body.candidates) {
			candidates.push(new AddressCandidate(candidate));
		}
		return { title: body.title, favicon: body.favicon, candidates };
	}
}
