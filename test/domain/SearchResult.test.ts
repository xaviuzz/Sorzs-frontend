import { describe, expect, test } from "bun:test";
import { SearchResult } from "@/domain/SearchResult";

describe("SearchResult", () => {
	const result = new SearchResult({
		title: "Search it on Google",
		url: "https://www.google.com/search?q=bun site:a.com",
		description: "Google search for «bun» limited to a.com",
		source: "Alpha",
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

	test("knows the source it came from", () => {
		expect(result.source).toBe("Alpha");
	});
});
