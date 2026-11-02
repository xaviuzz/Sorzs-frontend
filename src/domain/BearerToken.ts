import { NoToken } from "@/domain/NoToken";
import type { Role } from "@/domain/Role";
import type { Token } from "@/domain/Token";

import { UserRole } from "@/domain/UserRole";

export class BearerToken implements Token {
	constructor(
		private readonly value: string,
		private readonly assigned: Role = new UserRole(),
	) {}

	static from(text: string, role: Role = new UserRole()): Token {
		let token: Token = new BearerToken(text, role);
		if (text === "") {
			token = new NoToken();
		}
		return token;
	}

	role(): Role {
		return this.assigned;
	}

	text(): string {
		return this.value;
	}

	isPresent(): boolean {
		return true;
	}

	signed(request: Request): Request {
		const headers = new Headers(request.headers);
		headers.set("Authorization", `Bearer ${this.value}`);
		return new Request(request, { headers });
	}
}
