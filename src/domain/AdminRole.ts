import type { Role } from "@/domain/Role";
import { UserRole } from "@/domain/UserRole";

export class AdminRole implements Role {
	text(): string {
		return "admin";
	}

	mayEnterBackoffice(): boolean {
		return true;
	}

	opposite(): Role {
		return new UserRole();
	}

	changeLabel(): string {
		return "Make user";
	}
}
