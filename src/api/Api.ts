import type { Client } from "openapi-fetch";
import { HealthCheck } from "@/api/HealthCheck";
import type { paths } from "@/api/schema";

export class Api {
	readonly healthCheck: HealthCheck;

	constructor(client: Client<paths>) {
		this.healthCheck = new HealthCheck(client);
	}
}
