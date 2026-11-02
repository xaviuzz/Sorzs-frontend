import { beforeEach, describe, expect, test } from "bun:test";
import { LocalStorageTokenStore } from "@/components/session/LocalStorageTokenStore";
import { AdminRole } from "@/domain/AdminRole";
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

	test("reads the role saved with the token", () => {
		new LocalStorageTokenStore(localStorage).save(
			new BearerToken("t-1", new AdminRole()),
		);

		const store = new LocalStorageTokenStore(localStorage);

		expect(store.read()).toEqual(new BearerToken("t-1", new AdminRole()));
	});

	test("reads a token stored without a role as a user", () => {
		localStorage.setItem("sorzs.token", "t-1");

		const store = new LocalStorageTokenStore(localStorage);

		expect(store.read()).toEqual(new BearerToken("t-1"));
	});

	test("forgets the role when clearing", () => {
		const store = new LocalStorageTokenStore(localStorage);
		store.save(new BearerToken("t-1", new AdminRole()));
		store.clear();
		localStorage.setItem("sorzs.token", "t-2");

		expect(store.read()).toEqual(new BearerToken("t-2"));
	});

	test("reads no token after clearing", () => {
		const store = new LocalStorageTokenStore(localStorage);
		store.save(new BearerToken("t-1"));

		store.clear();

		expect(store.read()).toEqual(new NoToken());
	});
});
