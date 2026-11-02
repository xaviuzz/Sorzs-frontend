import type { Role } from "@/domain/Role";

export class AdminRole implements Role {
	text(): string {
		return "admin";
	}

	mayEnterBackoffice(): boolean {
		return true;
	}
}
