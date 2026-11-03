import type { Role } from "@/domain/Role";
import { roleNamed } from "@/domain/roleNamed";

export type UserEntryData = {
	username: string;
	role: string;
};

export class UserEntry {
	readonly username: string;
	readonly role: Role;

	constructor(data: UserEntryData) {
		this.username = data.username;
		this.role = roleNamed(data.role);
	}
}
