import { AdminRole } from "@/domain/AdminRole";
import type { Role } from "@/domain/Role";
import { UserRole } from "@/domain/UserRole";

export function roleNamed(text: string): Role {
	let role: Role = new UserRole();
	if (text === "admin") {
		role = new AdminRole();
	}
	return role;
}
