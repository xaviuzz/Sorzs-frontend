import type { Role } from "@/domain/Role";

export class UserRole implements Role {
	text(): string {
		return "user";
	}

	mayEnterBackoffice(): boolean {
		return false;
	}
}
