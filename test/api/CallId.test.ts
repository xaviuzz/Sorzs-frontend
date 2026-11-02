import { describe, expect, test } from "bun:test";
import { CallId } from "@/api/CallId";

describe("CallId", () => {
	test("heads a call with its identifier", () => {
		const header = CallId.next().header();

		expect(header.callId).toMatch(/^[0-9a-f-]{36}$/);
	});

	test("each call gets a fresh identifier", () => {
		const first = CallId.next().header();
		const second = CallId.next().header();

		expect(first.callId).not.toBe(second.callId);
	});
});
