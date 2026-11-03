import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import type { Role } from "@/domain/Role";
import { UserEntry } from "@/domain/UserEntry";

export class SetRole {
	constructor(private readonly client: Client<paths>) {}

	async run(username: string, role: Role): Promise<UserEntry> {
		const answer = await this.client.POST("/users.setRole", {
			body: {
				header: CallId.next().header(),
				body: { username, role: role.text() as "admin" | "user" },
			},
		});
		const body = Refusable.of(answer).success();
		return new UserEntry(body);
	}
}
