import { BearerToken } from "@/domain/BearerToken";
import { roleNamed } from "@/domain/roleNamed";
import type { Token } from "@/domain/Token";
import type { TokenStore } from "@/domain/TokenStore";

const KEY = "sorzs.token";
const ROLE_KEY = "sorzs.role";

export class LocalStorageTokenStore implements TokenStore {
	constructor(private readonly storage: Storage) {}

	read(): Token {
		const text = this.readItem(KEY);
		const role = roleNamed(this.readItem(ROLE_KEY));
		return BearerToken.from(text, role);
	}

	save(token: Token): void {
		this.storage.setItem(KEY, token.text());
		this.storage.setItem(ROLE_KEY, token.role().text());
	}

	clear(): void {
		this.storage.removeItem(KEY);
		this.storage.removeItem(ROLE_KEY);
	}

	private readItem(key: string): string {
		const stored = this.storage.getItem(key);
		let text = "";
		if (stored !== null) {
			text = stored;
		}
		return text;
	}
}
