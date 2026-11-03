import { describe, expect, test } from "bun:test";
import { UserEntry } from "@/domain/UserEntry";

describe("UserEntry", () => {
	test("knows its username", () => {
		const entry = new UserEntry({ username: "ana", role: "user" });

		expect(entry.username).toBe("ana");
	});

	test("knows its role by name", () => {
		const entry = new UserEntry({ username: "xaviuzz", role: "admin" });

		expect(entry.role.text()).toBe("admin");
	});
});
