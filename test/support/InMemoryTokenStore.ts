import { BearerToken } from "@/domain/BearerToken";
import type { Role } from "@/domain/Role";
import type { Token } from "@/domain/Token";
import type { TokenStore } from "@/domain/TokenStore";
import { UserRole } from "@/domain/UserRole";

export class InMemoryTokenStore implements TokenStore {
	private role: Role = new UserRole();

	constructor(private text = "") {}

	read(): Token {
		return BearerToken.from(this.text, this.role);
	}

	save(token: Token): void {
		this.text = token.text();
		this.role = token.role();
	}

	clear(): void {
		this.text = "";
		this.role = new UserRole();
	}
}
