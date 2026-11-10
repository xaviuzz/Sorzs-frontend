export type SearchResultData = {
	title: string;
	url: string;
	description: string;
	sorz: string;
};

export class SearchResult {
	readonly title: string;
	readonly url: string;
	readonly description: string;
	readonly sorz: string;

	constructor(data: SearchResultData) {
		this.title = data.title;
		this.url = data.url;
		this.description = data.description;
		this.sorz = data.sorz;
	}
}
