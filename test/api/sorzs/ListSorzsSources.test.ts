import { beforeEach, describe, expect, test } from "bun:test";
import createClient from "openapi-fetch";
import { CallRefusedError } from "@/api/CallRefusedError";
import type { paths } from "@/api/schema";
import { ListSorzsSources } from "@/api/sorzs/ListSorzsSources";
import { FaviconAt } from "@/domain/FaviconAt";
import { NoFavicon } from "@/domain/NoFavicon";
import {
	SorzsSourceEntry,
	type SorzsSourceEntryData,
} from "@/domain/SorzsSourceEntry";

describe("ListSorzsSources", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("answers the sources in the order the backend sent them", async () => {
		const alpha = {
			address: "https://a.com",
			favicon: "https://a.com/i.png",
			users: 2,
		};
		const beta = { address: "https://b.com", favicon: null, users: 1 };
		sut.answerSources([alpha, beta]);

		await sut.list();

		expect(sut.listed()).toEqual([
			new SorzsSourceEntry(alpha),
			new SorzsSourceEntry(beta),
		]);
	});

	test("a favicon is present when the backend sent it", async () => {
		sut.answerSources([
			{ address: "https://a.com", favicon: "https://a.com/i.png", users: 1 },
		]);

		await sut.list();

		expect(sut.listed()?.[0]?.favicon).toEqual(
			new FaviconAt("https://a.com/i.png"),
		);
	});

	test("a missing favicon is a null object", async () => {
		sut.answerSources([{ address: "https://a.com", favicon: null, users: 1 }]);

		await sut.list();

		expect(sut.listed()?.[0]?.favicon).toEqual(new NoFavicon());
	});

	test("answers no sources when the census is empty", async () => {
		sut.answerSources([]);

		await sut.list();

		expect(sut.listed()).toEqual([]);
	});

	test("posts to /sorzs.sources with a fresh callId", async () => {
		await sut.list();
		await sut.list();

		const [first, second] = sut.posted();
		expect(first?.path).toBe("/sorzs.sources");
		expect(first?.method).toBe("POST");
		expect(first?.callId).not.toBe(second?.callId);
	});

	test("a refusal reaches the caller with its code and message", async () => {
		sut.answerRefusal("FORBIDDEN", "forbidden");

		await sut.list();

		expect(sut.refusal()).toEqual({
			code: "FORBIDDEN",
			message: "forbidden",
		});
	});

	test("a forbidden transport answer reaches the caller with its code and message", async () => {
		sut.answerTransport(403, "FORBIDDEN", "forbidden");

		await sut.list();

		expect(sut.refusal()).toEqual({
			code: "FORBIDDEN",
			message: "forbidden",
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
	private entries: SorzsSourceEntry[] | undefined;
	private thrown: unknown;
	private readonly listSorzsSources: ListSorzsSources;

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
		this.listSorzsSources = new ListSorzsSources(client);
	}

	answerSources(sources: SorzsSourceEntryData[]) {
		this.answer = async (callId) => reply(callId, "ok", { sources });
	}

	answerRefusal(code: string, message: string) {
		this.answer = async (callId) => reply(callId, "error", { code, message });
	}

	answerTransport(status: number, code: string, message: string) {
		this.answer = async () => json(status, { code, message });
	}

	failNetwork() {
		this.answer = async () => {
			throw new TypeError("network down");
		};
	}

	async list() {
		try {
			this.entries = await this.listSorzsSources.run();
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
