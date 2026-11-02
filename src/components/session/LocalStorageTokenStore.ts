import { BearerToken } from "@/domain/BearerToken";
import type { Token } from "@/domain/Token";
import type { TokenStore } from "@/domain/TokenStore";

const KEY = "sorzs.token";

export class LocalStorageTokenStore implements TokenStore {
	constructor(private readonly storage: Storage) {}

	read(): Token {
		const stored = this.storage.getItem(KEY);
		let text = "";
		if (stored !== null) {
			text = stored;
		}
		return BearerToken.from(text);
	}

	save(token: Token): void {
		this.storage.setItem(KEY, token.text());
	}

	clear(): void {
		this.storage.removeItem(KEY);
	}
}
