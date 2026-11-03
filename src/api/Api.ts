import type { Client } from "openapi-fetch";
import { Login } from "@/api/auth/Login";
import { HealthCheck } from "@/api/health/HealthCheck";
import type { paths } from "@/api/schema";
import { ListSorzsSources } from "@/api/sorzs/ListSorzsSources";
import { AddSource } from "@/api/sources/AddSource";
import { InspectSource } from "@/api/sources/InspectSource";
import { ListSources } from "@/api/sources/ListSources";
import { SearchSources } from "@/api/sources/SearchSources";
import { AddUser } from "@/api/users/AddUser";
import { ListUsers } from "@/api/users/ListUsers";
import { SetRole } from "@/api/users/SetRole";

export class Api {
	readonly healthCheck: HealthCheck;
	readonly login: Login;
	readonly addSource: AddSource;
	readonly inspectSource: InspectSource;
	readonly listSources: ListSources;
	readonly searchSources: SearchSources;
	readonly listUsers: ListUsers;
	readonly listSorzsSources: ListSorzsSources;
	readonly addUser: AddUser;
	readonly setRole: SetRole;

	constructor(client: Client<paths>) {
		this.healthCheck = new HealthCheck(client);
		this.login = new Login(client);
		this.addSource = new AddSource(client);
		this.inspectSource = new InspectSource(client);
		this.listSources = new ListSources(client);
		this.searchSources = new SearchSources(client);
		this.listUsers = new ListUsers(client);
		this.listSorzsSources = new ListSorzsSources(client);
		this.addUser = new AddUser(client);
		this.setRole = new SetRole(client);
	}
}
