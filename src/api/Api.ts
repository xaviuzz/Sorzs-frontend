import type { Client } from "openapi-fetch";
import { AddSource } from "@/api/AddSource";
import { HealthCheck } from "@/api/HealthCheck";
import { ListSources } from "@/api/ListSources";
import type { paths } from "@/api/schema";

export class Api {
	readonly healthCheck: HealthCheck;
	readonly addSource: AddSource;
	readonly listSources: ListSources;

	constructor(client: Client<paths>) {
		this.healthCheck = new HealthCheck(client);
		this.addSource = new AddSource(client);
		this.listSources = new ListSources(client);
	}
}
