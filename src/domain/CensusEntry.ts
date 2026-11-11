import type { Favicon } from "@/domain/Favicon";
import { FaviconAt } from "@/domain/FaviconAt";
import { NoFavicon } from "@/domain/NoFavicon";
import { providerNamed } from "@/domain/providerNamed";
import type { SearchProvider } from "@/domain/SearchProvider";

export type CensusEntryData = {
	address: string;
	favicon: string | null;
	provider: string;
	users: number;
};

export class CensusEntry {
	readonly address: string;
	readonly favicon: Favicon;
	readonly provider: SearchProvider;
	readonly users: number;

	constructor(data: CensusEntryData) {
		this.address = data.address;
		this.favicon = this.faviconFrom(data.favicon);
		this.provider = providerNamed(data.provider);
		this.users = data.users;
	}

	isGeneric(): boolean {
		const isSpecific = this.provider.isSpecific();
		const isGeneric = !isSpecific;
		return isGeneric;
	}

	private faviconFrom(text: string | null): Favicon {
		let favicon: Favicon = new NoFavicon();
		if (text !== null) favicon = new FaviconAt(text);
		return favicon;
	}
}
