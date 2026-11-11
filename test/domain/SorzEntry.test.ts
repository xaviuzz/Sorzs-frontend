import { describe, expect, test } from "bun:test";
import { SorzEntry } from "@/domain/SorzEntry";

describe("SorzEntry", () => {
	test("is shown by its name when it has one", () => {
		const entry = entryWith({ name: "Mine", title: "Their title" });

		expect(entry.shownText()).toBe("Mine");
	});

	test("is shown by the title of its page when it has no name", () => {
		const entry = entryWith({ name: null, title: "Their title" });

		expect(entry.shownText()).toBe("Their title");
	});

	test("is shown by its address when it has neither name nor title", () => {
		const entry = entryWith({ name: null, title: null });

		expect(entry.shownText()).toBe("https://a.com");
	});

	test("knows its favicon", () => {
		const entry = entryWith({ favicon: "https://a.com/icon.png" });

		expect(entry.favicon).toBe("https://a.com/icon.png");
	});

	test("has no favicon when its page offers none", () => {
		const entry = entryWith({ favicon: null });

		expect(entry.favicon).toBeNull();
	});
});

describe("SorzEntry provider", () => {
	test("is searched by a specific provider when the backend names one", () => {
		const entry = entryWith({ provider: "reddit" });

		expect(entry.provider.isSpecific()).toBe(true);
	});

	test("says which specific provider searches it", () => {
		const entry = entryWith({ provider: "reddit" });

		expect(entry.provider.hint()).toBe("Searched by Reddit");
	});

	test("is searched by the generic provider otherwise", () => {
		const entry = entryWith({ provider: "generic" });

		expect(entry.provider.isSpecific()).toBe(false);
	});
});

function entryWith(parts: Partial<ConstructorParameters<typeof SorzEntry>[0]>) {
	return new SorzEntry({
		sorzId: "s-1",
		name: "Alpha",
		address: "https://a.com",
		title: null,
		favicon: null,
		provider: "generic",
		...parts,
	});
}
