import type { Client } from "openapi-fetch";
import { CallId } from "@/api/CallId";
import type { paths } from "@/api/schema";

export type Health = "ok" | "error";

export class HealthCheck {
	readonly #client: Client<paths>;

	constructor(client: Client<paths>) {
		this.#client = client;
	}

	async run(): Promise<Health> {
		let health: Health = "error";
		try {
			const answer = await this.#client.POST("/health.check", {
				body: { header: CallId.next().header() },
			});
			if (answer.data?.header.status === "ok") {
				health = "ok";
			}
		} catch {
			health = "error";
		}
		return health;
	}
}
