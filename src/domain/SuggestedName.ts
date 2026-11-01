const LIMIT = 60;
const SEPARATOR_FLOOR = 30;
const SEPARATOR_MARKS = "-|–—:;,.!?";
const ELLIPSIS = "…";

export class SuggestedName {
	private constructor(private readonly title: string) {}

	static from(title: string): SuggestedName {
		return new SuggestedName(title);
	}

	text(): string {
		if (this.title.length <= LIMIT) return this.title;
		let result = this.cutAtSpace();
		const separatorIndex = this.lastSeparatorIndex();
		if (separatorIndex >= 0) {
			result = this.title.slice(0, separatorIndex).trimEnd();
		}
		return result;
	}

	private lastSeparatorIndex(): number {
		let found = -1;
		for (let index = LIMIT; index >= SEPARATOR_FLOOR && found === -1; index--) {
			if (this.isSeparatorAt(index)) found = index;
		}
		return found;
	}

	private isSeparatorAt(index: number): boolean {
		const isMark = SEPARATOR_MARKS.includes(this.title.charAt(index));
		const hasSpaceBefore = this.title.charAt(index - 1) === " ";
		const hasSpaceAfter = this.title.charAt(index + 1) === " ";
		return isMark && (hasSpaceBefore || hasSpaceAfter);
	}

	private cutAtSpace(): string {
		const head = this.title.slice(0, LIMIT - 1);
		const spaceIndex = head.lastIndexOf(" ");
		let kept = head;
		if (spaceIndex > 0) {
			kept = head.slice(0, spaceIndex).trimEnd();
		}
		return `${kept}${ELLIPSIS}`;
	}
}
