import { AdminRole } from "@/domain/AdminRole";
import type { Role } from "@/domain/Role";

export class UserRole implements Role {
	text(): string {
		return "user";
	}

	mayEnterBackoffice(): boolean {
		return false;
	}

	opposite(): Role {
		return new AdminRole();
	}

	changeLabel(): string {
		return "Make admin";
	}
}
