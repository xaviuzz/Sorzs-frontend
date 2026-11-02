import type { Client } from "openapi-fetch";
import { Login } from "@/api/auth/Login";
import { HealthCheck } from "@/api/health/HealthCheck";
import type { paths } from "@/api/schema";
import { AddSource } from "@/api/sources/AddSource";
import { InspectSource } from "@/api/sources/InspectSource";
import { ListSources } from "@/api/sources/ListSources";
import { SearchSources } from "@/api/sources/SearchSources";

export class Api {
	readonly healthCheck: HealthCheck;
	readonly login: Login;
	readonly addSource: AddSource;
	readonly inspectSource: InspectSource;
	readonly listSources: ListSources;
	readonly searchSources: SearchSources;

	constructor(client: Client<paths>) {
		this.healthCheck = new HealthCheck(client);
		this.login = new Login(client);
		this.addSource = new AddSource(client);
		this.inspectSource = new InspectSource(client);
		this.listSources = new ListSources(client);
		this.searchSources = new SearchSources(client);
	}
}
