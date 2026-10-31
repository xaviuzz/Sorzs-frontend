export type SourceEntryData = {
	sourceId: string;
	name: string | null;
	address: string;
	title: string | null;
	favicon: string | null;
};

export class SourceEntry {
	readonly sourceId: string;
	readonly name: string | null;
	readonly address: string;
	readonly title: string | null;
	readonly favicon: string | null;

	constructor(data: SourceEntryData) {
		this.sourceId = data.sourceId;
		this.name = data.name;
		this.address = data.address;
		this.title = data.title;
		this.favicon = data.favicon;
	}

	shownText(): string {
		return this.name ?? this.title ?? this.address;
	}
}
