import { SuggestedName } from "@/domain/SuggestedName";

export type AddressCandidateData = {
	address: string;
	title: string;
	favicon: string | null;
};

export class AddressCandidate {
	readonly address: string;
	readonly title: string;
	readonly favicon: string | null;

	constructor(data: AddressCandidateData) {
		this.address = data.address;
		this.title = data.title;
		this.favicon = data.favicon;
	}

	suggestedName(): string {
		return SuggestedName.from(this.title).text();
	}

	isChosenBy(address: string, name: string): boolean {
		const hasAddress = this.address === address;
		const hasName = this.suggestedName() === name;
		return hasAddress && hasName;
	}
}
