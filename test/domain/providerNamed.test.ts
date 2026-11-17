import { expect, test } from "bun:test";
import { providerNamed } from "@/domain/providerNamed";

test("a generic provider is not specific and has no hint", () => {
	const provider = providerNamed("generic");

	expect(provider.isSpecific()).toBe(false);
	expect(provider.hint()).toBe("");
});

test("the reddit provider is specific", () => {
	const provider = providerNamed("reddit");

	expect(provider.isSpecific()).toBe(true);
	expect(provider.hint()).toBe("Searched by Reddit");
});

test("the wikipedia provider is specific", () => {
	const provider = providerNamed("wikipedia");

	expect(provider.isSpecific()).toBe(true);
	expect(provider.hint()).toBe("Searched by Wikipedia");
});

test("a provider it does not know is generic", () => {
	const provider = providerNamed("duckduckgo");

	expect(provider.isSpecific()).toBe(false);
});
