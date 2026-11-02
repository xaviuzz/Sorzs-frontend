import { beforeEach, describe, expect, test } from "bun:test";
import { BearerToken } from "@/domain/BearerToken";
import { Session } from "@/domain/Session";
import { InMemoryTokenStore } from "../support/InMemoryTokenStore";

describe("Session", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("is closed while the store holds no token", () => {
		expect(sut.isOpen()).toBe(false);
	});

	test("is open when the store already holds a token", () => {
		sut.startWithStored("t-1");

		expect(sut.isOpen()).toBe(true);
	});

	test("opens when a token enters and keeps it in the store", () => {
		sut.enter("t-1");

		expect(sut.isOpen()).toBe(true);
		expect(sut.stored()).toEqual(new BearerToken("t-1"));
	});

	test("closes when the user leaves and clears the store", () => {
		sut.startWithStored("t-1");

		sut.leave();

		expect(sut.isOpen()).toBe(false);
		expect(sut.stored().isPresent()).toBe(false);
	});

	test("signs requests with the token that entered", () => {
		sut.enter("t-1");

		expect(sut.signedHeader()).toBe("Bearer t-1");
	});

	test("signs nothing once the user leaves", () => {
		sut.enter("t-1");

		sut.leave();

		expect(sut.signedHeader()).toBeNull();
	});

	test("tells its listeners when a token enters or the user leaves", () => {
		sut.listen();

		sut.enter("t-1");
		sut.leave();

		expect(sut.notifications()).toBe(2);
	});

	test("stops telling a listener that unsubscribed", () => {
		sut.listen();
		sut.unsubscribe();

		sut.enter("t-1");

		expect(sut.notifications()).toBe(0);
	});
});

class SUT {
	private store = new InMemoryTokenStore();
	private session = new Session(this.store);
	private count = 0;
	private stop: () => void = () => {};

	startWithStored(text: string) {
		this.store = new InMemoryTokenStore(text);
		this.session = new Session(this.store);
	}

	enter(text: string) {
		this.session.enter(new BearerToken(text));
	}

	leave() {
		this.session.leave();
	}

	listen() {
		this.stop = this.session.subscribe(() => {
			this.count += 1;
		});
	}

	unsubscribe() {
		this.stop();
	}

	isOpen() {
		return this.session.isOpen();
	}

	stored() {
		return this.store.read();
	}

	signedHeader() {
		const request = new Request("http://localhost/sources.list");
		return this.session.signed(request).headers.get("Authorization");
	}

	notifications() {
		return this.count;
	}
}
