import { describe, expect, test } from "bun:test";
import { AddressCandidate } from "@/domain/AddressCandidate";

describe("AddressCandidate", () => {
	test("knows its address", () => {
		const candidate = candidateWith({ address: "https://a.com/docs" });

		expect(candidate.address).toBe("https://a.com/docs");
	});

	test("knows its title", () => {
		const candidate = candidateWith({ title: "Docs" });

		expect(candidate.title).toBe("Docs");
	});

	test("knows its favicon", () => {
		const candidate = candidateWith({ favicon: "https://a.com/icon.png" });

		expect(candidate.favicon).toBe("https://a.com/icon.png");
	});

	test("has no favicon when its page offers none", () => {
		const candidate = candidateWith({ favicon: null });

		expect(candidate.favicon).toBeNull();
	});

	test("suggests its title as a name", () => {
		const candidate = candidateWith({ title: "Docs" });

		expect(candidate.suggestedName()).toBe("Docs");
	});

	test("suggests a long title shortened to fit a name", () => {
		const candidate = candidateWith({
			title:
				"elDiario.es - Noticias de actualidad - Periodismo a pesar de todo",
		});

		expect(candidate.suggestedName()).toBe(
			"elDiario.es - Noticias de actualidad",
		);
	});

	test("is chosen by its address and its suggested name", () => {
		const candidate = candidateWith({ address: "https://a.com", title: "A" });

		expect(candidate.isChosenBy("https://a.com", "A")).toBe(true);
	});

	test("is not chosen by another address", () => {
		const candidate = candidateWith({ address: "https://a.com", title: "A" });

		expect(candidate.isChosenBy("https://a.com/docs", "A")).toBe(false);
	});

	test("is not chosen by another name", () => {
		const candidate = candidateWith({ address: "https://a.com", title: "A" });

		expect(candidate.isChosenBy("https://a.com", "Mine")).toBe(false);
	});
});

function candidateWith(
	parts: Partial<ConstructorParameters<typeof AddressCandidate>[0]>,
) {
	return new AddressCandidate({
		address: "https://a.com",
		title: "A",
		favicon: null,
		...parts,
	});
}
