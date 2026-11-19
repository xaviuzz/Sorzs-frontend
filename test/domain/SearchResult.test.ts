import { describe, expect, test } from "bun:test";
import { SearchResult } from "@/domain/SearchResult";

describe("SearchResult", () => {
	const result = new SearchResult({
		title: "Search it on Google",
		url: "https://www.google.com/search?q=bun site:a.com",
		description: "Google search for «bun» limited to a.com",
		sorz: "Alpha",
	});

	test("knows its title", () => {
		expect(result.title).toBe("Search it on Google");
	});

	test("knows its url", () => {
		expect(result.url).toBe("https://www.google.com/search?q=bun site:a.com");
	});

	test("knows its description", () => {
		expect(result.description).toBe("Google search for «bun» limited to a.com");
	});

	test("has a description when it is not empty", () => {
		expect(result.hasDescription()).toBe(true);
	});

	test("has no description when it is empty", () => {
		const bare = new SearchResult({
			title: "AdaCamp",
			url: "https://geekfeminism.fandom.com/wiki/AdaCamp",
			description: "",
			sorz: "Alpha",
		});

		expect(bare.hasDescription()).toBe(false);
	});

	test("knows the sorz it came from", () => {
		expect(result.sorz).toBe("Alpha");
	});
});
