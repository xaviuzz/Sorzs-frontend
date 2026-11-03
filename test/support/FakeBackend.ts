import createClient from "openapi-fetch";
import type { paths } from "@/api/schema";

export type Posted = {
	path: string;
	method: string;
	callId: string;
	body: unknown;
};

export class FakeBackend {
	readonly client;
	private answer: (callId: string) => Promise<Response> = async (callId) =>
		reply(callId, "ok", {});
	private received: Posted[] = [];

	constructor() {
		this.client = createClient<paths>({
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
	}

	answerOk(body: unknown) {
		this.answer = async (callId) => reply(callId, "ok", body);
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

	posted(): Posted[] {
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
