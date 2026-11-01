import { beforeEach, describe, expect, test } from "bun:test";
import createClient from "openapi-fetch";
import { CallRefusedError } from "@/api/CallRefusedError";
import { SearchSources } from "@/api/SearchSources";
import type { paths } from "@/api/schema";
import { SearchResult, type SearchResultData } from "@/domain/SearchResult";

describe("SearchSources", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("answers the results in the order the backend sent them", async () => {
		const beta = {
			title: "Search it on Google",
			url: "https://www.google.com/search?q=bun site:b.com",
			description: "Google search for «bun» limited to b.com",
			source: "Beta",
		};
		const alpha = {
			title: "Search it on Google",
			url: "https://www.google.com/search?q=bun site:a.com",
			description: "Google search for «bun» limited to a.com",
			source: "Alpha",
		};
		sut.answerResults([beta, alpha]);

		await sut.search("bun");

		expect(sut.found()).toEqual([
			new SearchResult(beta),
			new SearchResult(alpha),
		]);
	});

	test("answers no results when the backend found none", async () => {
		sut.answerResults([]);

		await sut.search("bun");

		expect(sut.found()).toEqual([]);
	});

	test("posts the query to /sources.search with a fresh callId", async () => {
		await sut.search("bun");
		await sut.search("react");

		const [first, second] = sut.posted();
		expect(first?.path).toBe("/sources.search");
		expect(first?.method).toBe("POST");
		expect(first?.body).toEqual({ query: "bun" });
		expect(first?.callId).not.toBe(second?.callId);
	});

	test("a refusal reaches the caller with its code and message", async () => {
		sut.answerRefusal("INVALID_BODY", "query is required");

		await sut.search("bun");

		expect(sut.refusal()).toEqual({
			code: "INVALID_BODY",
			message: "query is required",
		});
	});

	test("a bad call reaches the caller with its code and message", async () => {
		sut.answerBadCall("INVALID_BODY", "callId is required");

		await sut.search("bun");

		expect(sut.refusal()).toEqual({
			code: "INVALID_BODY",
			message: "callId is required",
		});
	});

	test("a network failure reaches the caller as it is", async () => {
		sut.failNetwork();

		await sut.search("bun");

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
		reply(callId, "ok", { results: [] });
	private received: Posted[] = [];
	private results: SearchResult[] | undefined;
	private thrown: unknown;
	private readonly searchSources: SearchSources;

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
		this.searchSources = new SearchSources(client);
	}

	answerResults(results: SearchResultData[]) {
		this.answer = async (callId) => reply(callId, "ok", { results });
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

	async search(query: string) {
		try {
			this.results = await this.searchSources.run(query);
		} catch (error) {
			this.thrown = error;
		}
	}

	found() {
		return this.results;
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
