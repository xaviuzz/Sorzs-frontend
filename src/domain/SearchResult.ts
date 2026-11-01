export type SearchResultData = {
	title: string;
	url: string;
	description: string;
	source: string;
};

export class SearchResult {
	readonly title: string;
	readonly url: string;
	readonly description: string;
	readonly source: string;

	constructor(data: SearchResultData) {
		this.title = data.title;
		this.url = data.url;
		this.description = data.description;
		this.source = data.source;
	}
}
