import type { Token } from "@/domain/Token";

export class NoToken implements Token {
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
