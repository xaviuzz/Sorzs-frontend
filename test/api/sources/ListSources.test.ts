import { beforeEach, describe, expect, test } from "bun:test";
import createClient from "openapi-fetch";
import { CallRefusedError } from "@/api/CallRefusedError";
import type { paths } from "@/api/schema";
import { ListSources } from "@/api/sources/ListSources";
import { SourceEntry, type SourceEntryData } from "@/domain/SourceEntry";

describe("ListSources", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("answers the entries in the order the backend sent them", async () => {
		const beta = {
			sourceId: "s-2",
			name: "Beta",
			address: "https://b.com",
			title: null,
			favicon: null,
		};
		const alpha = {
			sourceId: "s-1",
			name: "Alpha",
			address: "https://a.com",
			title: null,
			favicon: null,
		};
		sut.answerEntries([beta, alpha]);

		await sut.list();

		expect(sut.listed()).toEqual([
			new SourceEntry(beta),
			new SourceEntry(alpha),
		]);
	});

	test("answers no entries when the list is empty", async () => {
		sut.answerEntries([]);

		await sut.list();

		expect(sut.listed()).toEqual([]);
	});

	test("posts to /sources.list with a fresh callId", async () => {
		await sut.list();
		await sut.list();

		const [first, second] = sut.posted();
		expect(first?.path).toBe("/sources.list");
		expect(first?.method).toBe("POST");
		expect(first?.callId).not.toBe(second?.callId);
	});

	test("a refusal reaches the caller with its code and message", async () => {
		sut.answerRefusal("INTERNAL_ERROR", "internal error");

		await sut.list();

		expect(sut.refusal()).toEqual({
			code: "INTERNAL_ERROR",
			message: "internal error",
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

type Posted = { path: string; method: string; callId: string };

class SUT {
	private answer: (callId: string) => Promise<Response> = async (callId) =>
		reply(callId, "ok", { sources: [] });
	private received: Posted[] = [];
	private entries: SourceEntryData[] | undefined;
	private thrown: unknown;
	private readonly listSources: ListSources;

	constructor() {
		const client = createClient<paths>({
			baseUrl: "http://localhost",
			fetch: async (request) => {
				const call = await request.json();
				this.received.push({
					path: new URL(request.url).pathname,
					method: request.method,
					callId: call.header.callId,
				});
				return this.answer(call.header.callId);
			},
		});
		this.listSources = new ListSources(client);
	}

	answerEntries(entries: SourceEntryData[]) {
		this.answer = async (callId) => reply(callId, "ok", { sources: entries });
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

	async list() {
		try {
			this.entries = await this.listSources.run();
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
