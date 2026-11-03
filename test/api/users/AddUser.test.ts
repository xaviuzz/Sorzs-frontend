import { beforeEach, describe, expect, test } from "bun:test";
import { CallRefusedError } from "@/api/CallRefusedError";
import { AddUser } from "@/api/users/AddUser";
import { AdminRole } from "@/domain/AdminRole";
import type { Role } from "@/domain/Role";
import { UserEntry } from "@/domain/UserEntry";
import { UserRole } from "@/domain/UserRole";
import { FakeBackend } from "../../support/FakeBackend";

describe("AddUser", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("answers the user the backend created", async () => {
		sut.answerCreated({ username: "bea", role: "admin" });

		await sut.add("bea", "secret", new AdminRole());

		expect(sut.created()).toEqual(
			new UserEntry({ username: "bea", role: "admin" }),
		);
	});

	test("posts the username, the password and the role to /users.add with a fresh callId", async () => {
		await sut.add("bea", "secret", new AdminRole());
		await sut.add("cai", "other", new UserRole());

		const [first, second] = sut.posted();
		expect(first?.path).toBe("/users.add");
		expect(first?.method).toBe("POST");
		expect(first?.body).toEqual({
			username: "bea",
			password: "secret",
			role: "admin",
		});
		expect(second?.body).toEqual({
			username: "cai",
			password: "other",
			role: "user",
		});
		expect(first?.callId).not.toBe(second?.callId);
	});

	test("a refusal reaches the caller with its code and message", async () => {
		sut.answerRefusal("USERNAME_TAKEN", "that username is already taken");

		await sut.add("ana", "secret", new UserRole());

		expect(sut.refusal()).toEqual({
			code: "USERNAME_TAKEN",
			message: "that username is already taken",
		});
	});

	test("a bad call reaches the caller with its code and message", async () => {
		sut.answerBadCall("INVALID_BODY", "username is required");

		await sut.add("", "secret", new UserRole());

		expect(sut.refusal()).toEqual({
			code: "INVALID_BODY",
			message: "username is required",
		});
	});

	test("a network failure reaches the caller as it is", async () => {
		sut.failNetwork();

		await sut.add("bea", "secret", new UserRole());

		expect(sut.failure()).toBeInstanceOf(TypeError);
	});
});

class SUT {
	private readonly backend = new FakeBackend();
	private readonly addUser = new AddUser(this.backend.client);
	private entry: UserEntry | undefined;
	private thrown: unknown;

	constructor() {
		this.backend.answerOk({ username: "u", role: "user" });
	}

	answerCreated(user: { username: string; role: "admin" | "user" }) {
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

	async add(username: string, password: string, role: Role) {
		try {
			this.entry = await this.addUser.run(username, password, role);
		} catch (error) {
			this.thrown = error;
		}
	}

	created() {
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
