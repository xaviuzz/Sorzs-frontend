import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import { Refusable } from "@/api/Refusable";
import type { paths } from "@/api/schema";
import { BearerToken } from "@/domain/BearerToken";
import type { Token } from "@/domain/Token";

export class Login {
	constructor(private readonly client: Client<paths>) {}

	async run(username: string, password: string): Promise<Token> {
		const answer = await this.client.POST("/auth.login", {
			body: { header: CallId.next().header(), body: { username, password } },
		});
		const body = Refusable.of(answer).success();
		return new BearerToken(body.token);
	}
}
