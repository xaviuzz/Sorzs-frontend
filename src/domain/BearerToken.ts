import { NoToken } from "@/domain/NoToken";
import type { Token } from "@/domain/Token";

export class BearerToken implements Token {
	constructor(private readonly value: string) {}

	static from(text: string): Token {
		let token: Token = new BearerToken(text);
		if (text === "") {
			token = new NoToken();
		}
		return token;
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
