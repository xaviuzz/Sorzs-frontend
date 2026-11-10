import type { Favicon } from "@/domain/Favicon";
import { FaviconAt } from "@/domain/FaviconAt";
import { NoFavicon } from "@/domain/NoFavicon";

export type CensusEntryData = {
	address: string;
	favicon: string | null;
	users: number;
};

export class CensusEntry {
	readonly address: string;
	readonly favicon: Favicon;
	readonly users: number;

	constructor(data: CensusEntryData) {
		this.address = data.address;
		this.favicon = this.faviconFrom(data.favicon);
		this.users = data.users;
	}

	private faviconFrom(text: string | null): Favicon {
		let favicon: Favicon = new NoFavicon();
		if (text !== null) favicon = new FaviconAt(text);
		return favicon;
	}
}
