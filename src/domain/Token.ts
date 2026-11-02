import type { Role } from "@/domain/Role";

export interface Token {
	role(): Role;
	text(): string;
	isPresent(): boolean;
	signed(request: Request): Request;
}
