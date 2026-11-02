import { describe, expect, test } from "bun:test";
import { AddressCandidate } from "@/domain/AddressCandidate";
import { NameDraft } from "@/domain/NameDraft";

describe("NameDraft", () => {
	test("starts empty", () => {
		expect(NameDraft.empty().text()).toBe("");
	});

	test("keeps what the user types", () => {
		const draft = NameDraft.empty().type("My site");

		expect(draft.text()).toBe("My site");
	});

	test("takes the suggestion when nothing was typed", () => {
		const draft = NameDraft.empty().suggest("Page title");

		expect(draft.text()).toBe("Page title");
	});

	test("shortens a long suggestion like a suggested name", () => {
		const title = "a".repeat(80);

		const draft = NameDraft.empty().suggest(title);

		expect(draft.text()).toBe(`${"a".repeat(59)}…`);
	});

	test("replaces a previous suggestion", () => {
		const draft = NameDraft.empty().suggest("First").suggest("Second");

		expect(draft.text()).toBe("Second");
	});

	test("keeps what the user typed over a suggestion", () => {
		const draft = NameDraft.empty().type("Mine").suggest("Page title");

		expect(draft.text()).toBe("Mine");
	});

	test("keeps the name when there is no title to suggest", () => {
		const draft = NameDraft.empty().type("Mine").suggest(null);

		expect(draft.text()).toBe("Mine");
	});

	test("takes the name of a chosen candidate", () => {
		const candidate = new AddressCandidate({
			address: "https://a.com",
			title: "Candidate",
			favicon: null,
		});

		const draft = NameDraft.empty().type("Mine").choose(candidate);

		expect(draft.text()).toBe("Candidate");
	});

	test("replaces the name of a chosen candidate with a later suggestion", () => {
		const candidate = new AddressCandidate({
			address: "https://a.com",
			title: "Candidate",
			favicon: null,
		});

		const draft = NameDraft.empty().choose(candidate).suggest("Page title");

		expect(draft.text()).toBe("Page title");
	});
});
