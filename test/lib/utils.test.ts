import { describe, expect, test } from "bun:test";
import { cn } from "@/lib/utils";

describe("cn", () => {
	test("joins class names and drops falsy ones", () => {
		const classes = cn("p-2", false, "text-sm");

		expect(classes).toBe("p-2 text-sm");
	});

	test("lets the last Tailwind class win a conflict", () => {
		const classes = cn("p-2", "p-4");

		expect(classes).toBe("p-4");
	});
});
