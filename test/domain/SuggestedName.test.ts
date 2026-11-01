import { describe, expect, test } from "bun:test";
import { SuggestedName } from "@/domain/SuggestedName";

describe("SuggestedName", () => {
	test("keeps a title of 60 characters or fewer as it is", () => {
		const title = "a".repeat(60);

		expect(SuggestedName.from(title).text()).toBe(title);
	});

	test("cuts a long title at the last separator within the first 60 characters", () => {
		const title =
			"elDiario.es - Noticias de actualidad - Periodismo a pesar de todo";

		expect(SuggestedName.from(title).text()).toBe(
			"elDiario.es - Noticias de actualidad",
		);
	});

	test("ignores a separator before the 30th character", () => {
		const title = `Short one - ${"word ".repeat(15)}end`;

		expect(SuggestedName.from(title).text()).toBe(
			`Short one - ${"word ".repeat(8)}word…`,
		);
	});

	test("ignores punctuation that has no space beside it", () => {
		const title = `${"word ".repeat(7)}elDiario.es ${"word ".repeat(5)}end`;

		expect(SuggestedName.from(title).text()).toBe(
			`${"word ".repeat(7)}elDiario.es word word…`,
		);
	});

	test("cuts at the last space and adds an ellipsis when there is no separator", () => {
		const title = `${"word ".repeat(14)}end`;

		const text = SuggestedName.from(title).text();

		expect(text).toBe(`${"word ".repeat(10)}word…`);
		expect(text.length).toBeLessThanOrEqual(60);
	});

	test("cuts hard at 59 characters and adds an ellipsis when there is no space", () => {
		const title = "a".repeat(80);

		expect(SuggestedName.from(title).text()).toBe(`${"a".repeat(59)}…`);
	});
});
