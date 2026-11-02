export interface Token {
	text(): string;
	isPresent(): boolean;
	signed(request: Request): Request;
}
