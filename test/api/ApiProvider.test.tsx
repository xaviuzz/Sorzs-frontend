import { beforeEach, describe, expect, test } from "bun:test";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { ApiProvider, useListSources } from "@/api/ApiContext";
import { BearerToken } from "@/domain/BearerToken";
import { Session } from "@/domain/Session";
import { InMemoryTokenStore } from "../support/InMemoryTokenStore";

describe("ApiProvider", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("sends the token of the session on every call", async () => {
		sut.enter("t-1");

		await sut.listSources();

		expect(sut.authorizations()).toEqual(["Bearer t-1"]);
	});

	test("sends no Authorization header while the session holds no token", async () => {
		await sut.listSources();

		expect(sut.authorizations()).toEqual([null]);
	});

	test("forgets the token when the API answers 403", async () => {
		sut.enter("t-1");
		sut.answerForbidden();

		await sut.listSources();

		expect(sut.isOpen()).toBe(false);
	});

	test("keeps the session open when the API answers", async () => {
		sut.enter("t-1");

		await sut.listSources();

		expect(sut.isOpen()).toBe(true);
	});
});

class SUT {
	private readonly session = new Session(new InMemoryTokenStore());
	private received: (string | null)[] = [];
	private status = 200;

	enter(text: string) {
		this.session.enter(new BearerToken(text));
	}

	answerForbidden() {
		this.status = 403;
	}

	async listSources() {
		const { result } = renderHook(() => useListSources(), {
			wrapper: this.wrapper(),
		});
		try {
			await result.current.run();
		} catch {
			return;
		}
	}

	authorizations() {
		return this.received;
	}

	isOpen() {
		return this.session.isOpen();
	}

	private wrapper() {
		const answer = async (request: Request) => this.answer(request);
		const session = this.session;
		return function Wrapper({ children }: { children: ReactNode }) {
			return (
				<ApiProvider
					baseUrl="http://localhost"
					session={session}
					fetch={answer}
				>
					{children}
				</ApiProvider>
			);
		};
	}

	private answer(request: Request) {
		this.received.push(request.headers.get("Authorization"));
		let response = json(200, {
			header: { callId: "c", status: "ok" },
			body: { sources: [] },
		});
		if (this.status === 403) {
			response = json(403, { code: "FORBIDDEN", message: "forbidden" });
		}
		return response;
	}
}

function json(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json" },
	});
}
