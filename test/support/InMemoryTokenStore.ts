import { BearerToken } from "@/domain/BearerToken";
import type { Token } from "@/domain/Token";
import type { TokenStore } from "@/domain/TokenStore";

export class InMemoryTokenStore implements TokenStore {
	constructor(private text = "") {}

	read(): Token {
		return BearerToken.from(this.text);
	}

	save(token: Token): void {
		this.text = token.text();
	}

	clear(): void {
		this.text = "";
	}
}
