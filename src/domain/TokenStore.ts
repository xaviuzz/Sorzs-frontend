import type { Token } from "@/domain/Token";

export interface TokenStore {
	read(): Token;
	save(token: Token): void;
	clear(): void;
}
