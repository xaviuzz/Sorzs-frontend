import { beforeEach, describe, expect, test } from "bun:test";
import createClient from "openapi-fetch";
import { CallRefusedError } from "@/api/CallRefusedError";
import type { paths } from "@/api/schema";
import { AddSource } from "@/api/sources/AddSource";
import { SourceEntry, type SourceEntryData } from "@/domain/SourceEntry";

describe("AddSource", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("answers the entry the backend created", async () => {
		sut.answerCreated({
			sourceId: "s-1",
			name: "Example",
			address: "https://example.com",
			title: null,
			favicon: null,
		});

		await sut.add("https://example.com", "Example");

		expect(sut.created()).toEqual(
			new SourceEntry({
				sourceId: "s-1",
				name: "Example",
				address: "https://example.com",
				title: null,
				favicon: null,
			}),
		);
	});

	test("posts the address and the name to /sources.add with a fresh callId", async () => {
		await sut.add("https://example.com", "Example");
		await sut.add("https://other.com", "Other");

		const [first, second] = sut.posted();
		expect(first?.path).toBe("/sources.add");
		expect(first?.method).toBe("POST");
		expect(first?.body).toEqual({
			address: "https://example.com",
			name: "Example",
		});
		expect(first?.callId).not.toBe(second?.callId);
	});

	test("a refusal reaches the caller with its code and message", async () => {
		sut.answerRefusal("SOURCE_NAME_TAKEN", "that name is already in your list");

		await sut.add("https://example.com", "Example");

		expect(sut.refusal()).toEqual({
			code: "SOURCE_NAME_TAKEN",
			message: "that name is already in your list",
		});
	});

	test("a bad call reaches the caller with its code and message", async () => {
		sut.answerBadCall("INVALID_BODY", "callId is required");

		await sut.add("https://example.com", "Example");

		expect(sut.refusal()).toEqual({
			code: "INVALID_BODY",
			message: "callId is required",
		});
	});

	test("a network failure reaches the caller as it is", async () => {
		sut.failNetwork();

		await sut.add("https://example.com", "Example");

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
		reply(callId, "ok", {
			sourceId: "s-0",
			name: "n",
			address: "https://a.com",
			title: null,
			favicon: null,
		});
	private received: Posted[] = [];
	private entry: SourceEntry | undefined;
	private thrown: unknown;
	private readonly addSource: AddSource;

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
		this.addSource = new AddSource(client);
	}

	answerCreated(entry: SourceEntryData) {
		this.answer = async (callId) => reply(callId, "ok", entry);
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

	async add(address: string, name: string) {
		try {
			this.entry = await this.addSource.run(address, name);
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
