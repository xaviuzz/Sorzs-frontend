import { beforeEach, describe, expect, test } from "bun:test";
import { CallRefusedError } from "@/api/CallRefusedError";
import { ListUsers } from "@/api/users/ListUsers";
import { UserEntry } from "@/domain/UserEntry";
import { FakeBackend } from "../../support/FakeBackend";

describe("ListUsers", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("answers the users in the order the backend sent them", async () => {
		const ana = { username: "ana", role: "user" as const };
		const xaviuzz = { username: "xaviuzz", role: "admin" as const };
		sut.answerUsers([ana, xaviuzz]);

		await sut.list();

		expect(sut.listed()).toEqual([new UserEntry(ana), new UserEntry(xaviuzz)]);
	});

	test("answers no users when there are none", async () => {
		sut.answerUsers([]);

		await sut.list();

		expect(sut.listed()).toEqual([]);
	});

	test("posts to /users.list with a fresh callId", async () => {
		await sut.list();
		await sut.list();

		const [first, second] = sut.posted();
		expect(first?.path).toBe("/users.list");
		expect(first?.method).toBe("POST");
		expect(first?.callId).not.toBe(second?.callId);
	});

	test("a refusal reaches the caller with its code and message", async () => {
		sut.answerRefusal("FORBIDDEN", "only an admin may do this");

		await sut.list();

		expect(sut.refusal()).toEqual({
			code: "FORBIDDEN",
			message: "only an admin may do this",
		});
	});

	test("a bad call reaches the caller with its code and message", async () => {
		sut.answerBadCall("INVALID_BODY", "callId is required");

		await sut.list();

		expect(sut.refusal()).toEqual({
			code: "INVALID_BODY",
			message: "callId is required",
		});
	});

	test("a network failure reaches the caller as it is", async () => {
		sut.failNetwork();

		await sut.list();

		expect(sut.failure()).toBeInstanceOf(TypeError);
	});
});

class SUT {
	private readonly backend = new FakeBackend();
	private readonly listUsers = new ListUsers(this.backend.client);
	private entries: UserEntry[] = [];
	private thrown: unknown;

	constructor() {
		this.backend.answerOk({ users: [] });
	}

	answerUsers(users: { username: string; role: "admin" | "user" }[]) {
		this.backend.answerOk({ users });
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

	async list() {
		try {
			this.entries = await this.listUsers.run();
		} catch (error) {
			this.thrown = error;
		}
	}

	listed() {
		return this.entries;
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
