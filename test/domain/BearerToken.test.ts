import { describe, expect, test } from "bun:test";
import { BearerToken } from "@/domain/BearerToken";
import { NoToken } from "@/domain/NoToken";

describe("BearerToken", () => {
	test("signs a request with the Authorization header", () => {
		const request = new Request("http://localhost/sources.list");

		const signed = new BearerToken("t-1").signed(request);

		expect(signed.headers.get("Authorization")).toBe("Bearer t-1");
	});

	test("keeps the body of the request it signs", async () => {
		const request = new Request("http://localhost/auth.login", {
			method: "POST",
			body: "payload",
		});

		const signed = new BearerToken("t-1").signed(request);

		expect(await signed.text()).toBe("payload");
	});

	test("is present", () => {
		expect(new BearerToken("t-1").isPresent()).toBe(true);
	});

	test("comes from the text it was stored as", () => {
		expect(BearerToken.from("t-1")).toEqual(new BearerToken("t-1"));
	});

	test("comes from an empty text as no token", () => {
		expect(BearerToken.from("")).toEqual(new NoToken());
	});
});

describe("NoToken", () => {
	test("leaves a request as it is", () => {
		const request = new Request("http://localhost/sources.list");

		const signed = new NoToken().signed(request);

		expect(signed.headers.get("Authorization")).toBeNull();
	});

	test("is not present", () => {
		expect(new NoToken().isPresent()).toBe(false);
	});

	test("has no text", () => {
		expect(new NoToken().text()).toBe("");
	});
});
