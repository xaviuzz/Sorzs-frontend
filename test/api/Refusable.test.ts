import { beforeEach, describe, expect, test } from "bun:test";
import { CallRefusedError } from "@/api/CallRefusedError";
import { Refusable } from "@/api/Refusable";

describe("Refusable", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("hands over the body of a successful answer", () => {
		sut.answerBody({ sorzs: [] });

		sut.open();

		expect(sut.opened()).toEqual({ sorzs: [] });
	});

	test("a refusal in the body reaches the caller with its code and message", () => {
		sut.answerBody({ code: "INTERNAL_ERROR", message: "internal error" });

		sut.open();

		expect(sut.refusal()).toEqual({
			code: "INTERNAL_ERROR",
			message: "internal error",
		});
	});

	test("an error answer reaches the caller with its code and message", () => {
		sut.answerError({ code: "INVALID_BODY", message: "callId is required" });

		sut.open();

		expect(sut.refusal()).toEqual({
			code: "INVALID_BODY",
			message: "callId is required",
		});
	});
});

type Refusal = { code: "INTERNAL_ERROR" | "INVALID_BODY"; message: string };
type Sorzs = { sorzs: string[] };
type Answer =
	| { data: { body: Sorzs | Refusal }; error?: undefined }
	| { data?: undefined; error: Refusal };

class SUT {
	private answer: Answer = { data: { body: { sorzs: [] } } };
	private body: Sorzs | undefined;
	private thrown: unknown;

	answerBody(body: Sorzs | Refusal) {
		this.answer = { data: { body } };
	}

	answerError(error: Refusal) {
		this.answer = { error };
	}

	open() {
		try {
			this.body = Refusable.of(this.answer).success();
		} catch (error) {
			this.thrown = error;
		}
	}

	opened() {
		return this.body;
	}

	refusal() {
		let refusal: { code: string; message: string } | undefined;
		if (this.thrown instanceof CallRefusedError) {
			refusal = { code: this.thrown.code, message: this.thrown.message };
		}
		return refusal;
	}
}
