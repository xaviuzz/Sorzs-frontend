import { expect, test } from "bun:test";
import { SearchProvider } from "@/domain/SearchProvider";

test("a generic provider is not specific and has no hint", () => {
	const provider = new SearchProvider("generic", "Generic");

	expect(provider.isSpecific()).toBe(false);
	expect(provider.hint()).toBe("");
});

test("the reddit provider is specific", () => {
	const provider = new SearchProvider("reddit", "Reddit");

	expect(provider.isSpecific()).toBe(true);
	expect(provider.hint()).toBe("Searched by Reddit");
});

test("the wikipedia provider is specific", () => {
	const provider = new SearchProvider("wikipedia", "Wikipedia");

	expect(provider.isSpecific()).toBe(true);
	expect(provider.hint()).toBe("Searched by Wikipedia");
});

test("the geekfeminism provider is specific", () => {
	const provider = new SearchProvider("geekfeminism", "Geek Feminism");

	expect(provider.isSpecific()).toBe(true);
	expect(provider.hint()).toBe("Searched by Geek Feminism");
});

test("a provider the frontend never heard of is specific and says its name", () => {
	const provider = new SearchProvider("appropedia", "Appropedia");

	expect(provider.isSpecific()).toBe(true);
	expect(provider.hint()).toBe("Searched by Appropedia");
});
