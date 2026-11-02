import { beforeEach, describe, expect, test } from "bun:test";
import createClient from "openapi-fetch";
import { Login } from "@/api/auth/Login";
import { CallRefusedError } from "@/api/CallRefusedError";
import type { paths } from "@/api/schema";
import { AdminRole } from "@/domain/AdminRole";
import { BearerToken } from "@/domain/BearerToken";
import type { Token } from "@/domain/Token";

describe("Login", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("answers the token the backend issued", async () => {
		sut.answerToken("t-1");

		await sut.enter("xaviuzz", "p1casso");

		expect(sut.issued()).toEqual(new BearerToken("t-1"));
	});

	test("answers the role the backend named", async () => {
		sut.answerToken("t-1", "admin");

		await sut.enter("xaviuzz", "p1casso");

		expect(sut.issued()).toEqual(new BearerToken("t-1", new AdminRole()));
	});

	test("posts the username and the password to /auth.login with a fresh callId", async () => {
		await sut.enter("xaviuzz", "p1casso");
		await sut.enter("xaviuzz", "p1casso");

		const [first, second] = sut.posted();
		expect(first?.path).toBe("/auth.login");
		expect(first?.method).toBe("POST");
		expect(first?.body).toEqual({ username: "xaviuzz", password: "p1casso" });
		expect(first?.callId).not.toBe(second?.callId);
	});

	test("a refusal reaches the caller with its code and message", async () => {
		sut.answerRefusal("INVALID_CREDENTIALS", "username or password is wrong");

		await sut.enter("xaviuzz", "nope");

		expect(sut.refusal()).toEqual({
			code: "INVALID_CREDENTIALS",
			message: "username or password is wrong",
		});
	});

	test("a network failure reaches the caller as it is", async () => {
		sut.failNetwork();

		await sut.enter("xaviuzz", "p1casso");

		expect(sut.failure()).toBeInstanceOf(TypeError);
	});
});

type Posted = {
	path: string;
	method: string;
	callId: string;
	body: unknown;
};

class SUT {
	private answer: (callId: string) => Promise<Response> = async (callId) =>
		reply(callId, "ok", { token: "t-0", role: "user" });
	private received: Posted[] = [];
	private token: Token | undefined;
	private thrown: unknown;
	private readonly login: Login;

	constructor() {
		const client = createClient<paths>({
			baseUrl: "http://localhost",
			fetch: async (request) => {
				const call = await request.json();
				this.received.push({
					path: new URL(request.url).pathname,
					method: request.method,
					callId: call.header.callId,
					body: call.body,
				});
				return this.answer(call.header.callId);
			},
		});
		this.login = new Login(client);
	}

	answerToken(token: string, role = "user") {
		this.answer = async (callId) => reply(callId, "ok", { token, role });
	}

	answerRefusal(code: string, message: string) {
		this.answer = async (callId) => reply(callId, "error", { code, message });
	}

	failNetwork() {
		this.answer = async () => {
			throw new TypeError("network down");
		};
	}

	async enter(username: string, password: string) {
		try {
			this.token = await this.login.run(username, password);
		} catch (error) {
			this.thrown = error;
		}
	}

	issued() {
		return this.token;
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
		return this.received;
	}
}

function reply(callId: string, status: string, body: unknown) {
	const message = { header: { callId, status }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
