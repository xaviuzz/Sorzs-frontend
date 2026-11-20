const GENERIC = "generic";

export class SearchProvider {
	constructor(
		private readonly id: string,
		private readonly name: string,
	) {}

	isSpecific(): boolean {
		const isGeneric = this.id === GENERIC;
		const isSpecific = !isGeneric;
		return isSpecific;
	}

	hint(): string {
		let hint = "";
		if (this.isSpecific()) hint = `Searched by ${this.name}`;
		return hint;
	}
}
