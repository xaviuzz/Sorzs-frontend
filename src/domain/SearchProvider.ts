export interface SearchProvider {
	isSpecific(): boolean;
	hint(): string;
}
