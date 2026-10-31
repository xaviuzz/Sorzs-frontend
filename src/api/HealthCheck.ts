import type { Client } from "openapi-fetch";
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
			const callId = crypto.randomUUID();
			const answer = await this.#client.POST("/health.check", {
				body: { header: { callId } },
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
