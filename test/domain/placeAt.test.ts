import { describe, expect, test } from "bun:test";
import { allSections } from "@/domain/backofficeSections";
import { placeAt } from "@/domain/placeAt";

describe("placeAt", () => {
	test("keeps an ordinary path in Sorzs", () => {
		const sut = placeAt("/", true);

		expect(sut.path()).toBe("/");
		expect(sut.choose({ sorzs: () => "sorzs", backoffice: () => "back" })).toBe(
			"sorzs",
		);
	});

	test("sends /backoffice to the Users section for an admin", () => {
		const sut = placeAt("/backoffice", true);

		expect(sut.path()).toBe("/backoffice/users");
		expect(sut.choose({ sorzs: () => "", backoffice: (s) => s.title() })).toBe(
			"Users",
		);
	});

	test("shows the Sorzs section at /backoffice/sorzs for an admin", () => {
		const sut = placeAt("/backoffice/sorzs", true);

		expect(sut.path()).toBe("/backoffice/sorzs");
		expect(sut.choose({ sorzs: () => "", backoffice: (s) => s.title() })).toBe(
			"Sorzs",
		);
	});

	test("sends a path inside the backoffice nobody knows to Users", () => {
		const sut = placeAt("/backoffice/nope", true);

		expect(sut.path()).toBe("/backoffice/users");
	});

	test.each(["/backoffice", "/backoffice/users", "/backoffice/sorzs"])(
		"sends a user who is not an admin from %s to Sorzs",
		(path) => {
			const sut = placeAt(path, false);

			expect(sut.path()).toBe("/");
			expect(
				sut.choose({ sorzs: () => "sorzs", backoffice: () => "back" }),
			).toBe("sorzs");
		},
	);

	test("does not take another path starting with the same letters for the backoffice", () => {
		const sut = placeAt("/backoffices", false);

		expect(sut.path()).toBe("/backoffices");
	});

	test("lists the sections in order, marking the one in place", () => {
		const sut = placeAt("/backoffice/sorzs", true);

		const marked = sut.choose({
			sorzs: () => [],
			backoffice: (active) =>
				allSections().map((s) => `${s.title()}:${active.is(s)}`),
		});

		expect(marked).toEqual(["Users:false", "Sorzs:true"]);
	});
});
