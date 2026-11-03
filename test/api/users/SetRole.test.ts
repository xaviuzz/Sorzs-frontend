import { beforeEach, describe, expect, test } from "bun:test";
import { CallRefusedError } from "@/api/CallRefusedError";
import { SetRole } from "@/api/users/SetRole";
import { AdminRole } from "@/domain/AdminRole";
import type { Role } from "@/domain/Role";
import { UserEntry } from "@/domain/UserEntry";
import { UserRole } from "@/domain/UserRole";
import { FakeBackend } from "../../support/FakeBackend";

describe("SetRole", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("answers the user with the role the backend set", async () => {
		sut.answerChanged({ username: "ana", role: "admin" });

		await sut.set("ana", new AdminRole());

		expect(sut.changed()).toEqual(
			new UserEntry({ username: "ana", role: "admin" }),
		);
	});

	test("posts the username and the role to /users.setRole with a fresh callId", async () => {
		await sut.set("ana", new AdminRole());
		await sut.set("ana", new UserRole());

		const [first, second] = sut.posted();
		expect(first?.path).toBe("/users.setRole");
		expect(first?.method).toBe("POST");
		expect(first?.body).toEqual({ username: "ana", role: "admin" });
		expect(second?.body).toEqual({ username: "ana", role: "user" });
		expect(first?.callId).not.toBe(second?.callId);
	});

	test("a refusal reaches the caller with its code and message", async () => {
		sut.answerRefusal("LAST_ADMIN", "the last admin cannot be made a user");

		await sut.set("xaviuzz", new UserRole());

		expect(sut.refusal()).toEqual({
			code: "LAST_ADMIN",
			message: "the last admin cannot be made a user",
		});
	});

	test("a bad call reaches the caller with its code and message", async () => {
		sut.answerBadCall("INVALID_BODY", "unknown username");

		await sut.set("nobody", new UserRole());

		expect(sut.refusal()).toEqual({
			code: "INVALID_BODY",
			message: "unknown username",
		});
	});

	test("a network failure reaches the caller as it is", async () => {
		sut.failNetwork();

		await sut.set("ana", new UserRole());

		expect(sut.failure()).toBeInstanceOf(TypeError);
	});
});

class SUT {
	private readonly backend = new FakeBackend();
	private readonly setRole = new SetRole(this.backend.client);
	private entry: UserEntry | undefined;
	private thrown: unknown;

	constructor() {
		this.backend.answerOk({ username: "u", role: "user" });
	}

	answerChanged(user: { username: string; role: "admin" | "user" }) {
		this.backend.answerOk(user);
	}

	answerRefusal(code: string, message: string) {
		this.backend.answerRefusal(code, message);
	}

	answerBadCall(code: string, message: string) {
		this.backend.answerBadCall(code, message);
	}

	failNetwork() {
		this.backend.failNetwork();
	}

	async set(username: string, role: Role) {
		try {
			this.entry = await this.setRole.run(username, role);
		} catch (error) {
			this.thrown = error;
		}
	}

	changed() {
		return this.entry;
	}

	refusal() {
		let refusal: { code: string; message: string } | undefined;
		if (this.thrown instanceof CallRefusedError) {
			refusal = { code: this.thrown.code, message: this.thrown.message };
		}
		return refusal;
	}

	failure() {
		return this.thrown;
	}

	posted() {
		return this.backend.posted();
	}
}
