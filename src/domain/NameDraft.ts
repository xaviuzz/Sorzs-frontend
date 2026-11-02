import type { AddressCandidate } from "@/domain/AddressCandidate";
import { SuggestedName } from "@/domain/SuggestedName";

export class NameDraft {
	private constructor(
		private readonly name: string,
		private readonly suggested: string,
	) {}

	static empty(): NameDraft {
		return new NameDraft("", "");
	}

	text(): string {
		return this.name;
	}

	type(name: string): NameDraft {
		return new NameDraft(name, this.suggested);
	}

	suggest(title: string | null): NameDraft {
		if (title === null || !this.isFree()) return this;
		const suggestion = SuggestedName.from(title).text();
		return new NameDraft(suggestion, suggestion);
	}

	choose(candidate: AddressCandidate): NameDraft {
		const suggestion = candidate.suggestedName();
		return new NameDraft(suggestion, suggestion);
	}

	private isFree(): boolean {
		const isEmpty = this.name === "";
		const isSuggestion = this.name === this.suggested;
		return isEmpty || isSuggestion;
	}
}
