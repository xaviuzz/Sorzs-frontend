import { beforeEach, describe, expect, test } from "bun:test";
import { LocalStorageTokenStore } from "@/components/session/LocalStorageTokenStore";
import { BearerToken } from "@/domain/BearerToken";
import { NoToken } from "@/domain/NoToken";

describe("LocalStorageTokenStore", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test("reads no token when nothing was saved", () => {
		const store = new LocalStorageTokenStore(localStorage);

		expect(store.read()).toEqual(new NoToken());
	});

	test("reads the token saved by another store on the same storage", () => {
		new LocalStorageTokenStore(localStorage).save(new BearerToken("t-1"));

		const store = new LocalStorageTokenStore(localStorage);

		expect(store.read()).toEqual(new BearerToken("t-1"));
	});

	test("reads no token after clearing", () => {
		const store = new LocalStorageTokenStore(localStorage);
		store.save(new BearerToken("t-1"));

		store.clear();

		expect(store.read()).toEqual(new NoToken());
	});
});
