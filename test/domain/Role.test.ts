import { describe, expect, test } from "bun:test";
import { AdminRole } from "@/domain/AdminRole";
import { UserRole } from "@/domain/UserRole";

describe("Role", () => {
	test("an admin is changed into a user, with the label to make one", () => {
		const role = new AdminRole();

		expect(role.opposite().text()).toBe("user");
		expect(role.changeLabel()).toBe("Make user");
	});

	test("a user is changed into an admin, with the label to make one", () => {
		const role = new UserRole();

		expect(role.opposite().text()).toBe("admin");
		expect(role.changeLabel()).toBe("Make admin");
	});
});
