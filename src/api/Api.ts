import type { Client } from "openapi-fetch";
import { Login } from "@/api/auth/Login";
import { HealthCheck } from "@/api/health/HealthCheck";
import type { paths } from "@/api/schema";
import { AddSorz } from "@/api/sorzs/AddSorz";
import { InspectSorz } from "@/api/sorzs/InspectSorz";
import { ListCensus } from "@/api/sorzs/ListCensus";
import { ListSorzs } from "@/api/sorzs/ListSorzs";
import { SearchSorzs } from "@/api/sorzs/SearchSorzs";
import { AddUser } from "@/api/users/AddUser";
import { ListUsers } from "@/api/users/ListUsers";
import { SetRole } from "@/api/users/SetRole";

export class Api {
	readonly healthCheck: HealthCheck;
	readonly login: Login;
	readonly addSorz: AddSorz;
	readonly inspectSorz: InspectSorz;
	readonly listSorzs: ListSorzs;
	readonly searchSorzs: SearchSorzs;
	readonly listUsers: ListUsers;
	readonly listCensus: ListCensus;
	readonly addUser: AddUser;
	readonly setRole: SetRole;

	constructor(client: Client<paths>) {
		this.healthCheck = new HealthCheck(client);
		this.login = new Login(client);
		this.addSorz = new AddSorz(client);
		this.inspectSorz = new InspectSorz(client);
		this.listSorzs = new ListSorzs(client);
		this.searchSorzs = new SearchSorzs(client);
		this.listUsers = new ListUsers(client);
		this.listCensus = new ListCensus(client);
		this.addUser = new AddUser(client);
		this.setRole = new SetRole(client);
	}
}
