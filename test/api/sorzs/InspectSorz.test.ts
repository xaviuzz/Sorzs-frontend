import { beforeEach, describe, expect, test } from "bun:test";
import createClient from "openapi-fetch";
import { CallRefusedError } from "@/api/CallRefusedError";
import type { paths } from "@/api/schema";
import { InspectSorz } from "@/api/sorzs/InspectSorz";
import { AddressCandidate } from "@/domain/AddressCandidate";

describe("InspectSorz", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("answers the title and the favicon the backend found", async () => {
		sut.answerPage({
			title: "Example",
			favicon: "https://example.com/i.png",
			candidates: [],
		});

		await sut.inspect("https://example.com");

		expect(sut.inspected()).toEqual({
			title: "Example",
			favicon: "https://example.com/i.png",
			candidates: [],
		});
	});

	test("answers missing parts as nothing", async () => {
		sut.answerPage({ title: null, favicon: null, candidates: [] });

		await sut.inspect("https://example.com");

		expect(sut.inspected()).toEqual({
			title: null,
			favicon: null,
			candidates: [],
		});
	});

	test("answers the candidates as address candidates, in the order sent", async () => {
		sut.answerPage({
			title: "Deep",
			favicon: null,
			candidates: [
				{
					address: "https://a.com",
					title: "A",
					favicon: "https://a.com/i.png",
				},
				{ address: "https://a.com/docs", title: "Docs", favicon: null },
			],
		});

		await sut.inspect("https://a.com/docs");

		expect(sut.inspected()?.candidates).toEqual([
			new AddressCandidate({
				address: "https://a.com",
				title: "A",
				favicon: "https://a.com/i.png",
			}),
			new AddressCandidate({
				address: "https://a.com/docs",
				title: "Docs",
				favicon: null,
			}),
		]);
	});

	test("posts the address to /sorzs.inspect with a fresh callId", async () => {
		await sut.inspect("https://example.com");
		await sut.inspect("https://other.com");

		const [first, second] = sut.posted();
		expect(first?.path).toBe("/sorzs.inspect");
		expect(first?.method).toBe("POST");
		expect(first?.body).toEqual({ address: "https://example.com" });
		expect(first?.callId).not.toBe(second?.callId);
	});

	test("a refusal reaches the caller with its code and message", async () => {
		sut.answerRefusal("INVALID_BODY", "address is required");

		await sut.inspect("https://example.com");

		expect(sut.refusal()).toEqual({
			code: "INVALID_BODY",
			message: "address is required",
		});
	});

	test("a bad call reaches the caller with its code and message", async () => {
		sut.answerBadCall("INVALID_BODY", "callId is required");

		await sut.inspect("https://example.com");

		expect(sut.refusal()).toEqual({
			code: "INVALID_BODY",
			message: "callId is required",
		});
	});

	test("a network failure reaches the caller as it is", async () => {
		sut.failNetwork();

		await sut.inspect("https://example.com");

		expect(sut.failure()).toBeInstanceOf(TypeError);
	});
});

type Page = {
	title: string | null;
	favicon: string | null;
	candidates: { address: string; title: string; favicon: string | null }[];
};

type Posted = {
	path: string;
	method: string;
	callId: string;
	body: unknown;
};

class SUT {
	private answer: (callId: string) => Promise<Response> = async (callId) =>
		reply(callId, "ok", { title: null, favicon: null, candidates: [] });
	private received: Posted[] = [];
	private page: Page | undefined;
	private thrown: unknown;
	private readonly inspectSorz: InspectSorz;

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
		this.inspectSorz = new InspectSorz(client);
	}

	answerPage(page: Page) {
		this.answer = async (callId) => reply(callId, "ok", page);
	}

	answerRefusal(code: string, message: string) {
		this.answer = async (callId) => reply(callId, "error", { code, message });
	}

	answerBadCall(code: string, message: string) {
		this.answer = async () => json(400, { code, message });
	}

	failNetwork() {
		this.answer = async () => {
			throw new TypeError("network down");
		};
	}

	async inspect(address: string) {
		try {
			this.page = await this.inspectSorz.run(address);
		} catch (error) {
			this.thrown = error;
		}
	}

	inspected() {
		return this.page;
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
	return json(200, { header: { callId, status }, body });
}

function json(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json" },
	});
}
