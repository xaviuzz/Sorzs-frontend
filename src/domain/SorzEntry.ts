import { providerNamed } from "@/domain/providerNamed";
import type { SearchProvider } from "@/domain/SearchProvider";

export type SorzEntryData = {
	sorzId: string;
	name: string | null;
	address: string;
	title: string | null;
	favicon: string | null;
	provider: string;
};

export class SorzEntry {
	readonly sorzId: string;
	readonly name: string | null;
	readonly address: string;
	readonly title: string | null;
	readonly favicon: string | null;
	readonly provider: SearchProvider;

	constructor(data: SorzEntryData) {
		this.sorzId = data.sorzId;
		this.name = data.name;
		this.address = data.address;
		this.title = data.title;
		this.favicon = data.favicon;
		this.provider = providerNamed(data.provider);
	}

	shownText(): string {
		return this.name ?? this.title ?? this.address;
	}
}
