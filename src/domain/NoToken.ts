import type { Role } from "@/domain/Role";
import type { Token } from "@/domain/Token";

import { UserRole } from "@/domain/UserRole";

export class NoToken implements Token {
	role(): Role {
		return new UserRole();
	}

	text(): string {
		return "";
	}

	isPresent(): boolean {
		return false;
	}

	signed(request: Request): Request {
		return request;
	}
}
