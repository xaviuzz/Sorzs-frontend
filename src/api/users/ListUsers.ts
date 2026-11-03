import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import { UserEntry } from "@/domain/UserEntry";

export class ListUsers {
	constructor(private readonly client: Client<paths>) {}

	async run(): Promise<UserEntry[]> {
		const answer = await this.client.POST("/users.list", {
			body: { header: CallId.next().header() },
		});
		const body = Refusable.of(answer).success();
		const entries: UserEntry[] = [];
		for (const data of body.users) {
			entries.push(new UserEntry(data));
		}
		return entries;
	}
}
