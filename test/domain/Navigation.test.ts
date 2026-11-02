import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Navigation } from "@/domain/Navigation";

describe("Navigation", () => {
	let sut: Navigation;
	let notified: number;
	let stop: () => void;

	beforeEach(() => {
		window.happyDOM.setURL("http://localhost/");
		sut = new Navigation(window);
		notified = 0;
		stop = sut.subscribe(() => {
			notified += 1;
		});
	});

	afterEach(() => {
		stop();
	});

	test("starts at the path of the address", () => {
		window.happyDOM.setURL("http://localhost/backoffice/sorzs");

		expect(new Navigation(window).path()).toBe("/backoffice/sorzs");
	});

	test("goes to a path, changing the address and telling its listeners", () => {
		sut.go("/backoffice/users");

		expect(sut.path()).toBe("/backoffice/users");
		expect(window.location.pathname).toBe("/backoffice/users");
		expect(notified).toBe(1);
	});

	test("replaces the path without adding history", () => {
		const before = window.history.length;

		sut.replace("/backoffice/users");

		expect(sut.path()).toBe("/backoffice/users");
		expect(window.history.length).toBe(before);
		expect(notified).toBe(1);
	});

	test("tells its listeners when the browser goes back", () => {
		window.dispatchEvent(new PopStateEvent("popstate"));

		expect(notified).toBe(1);
	});
});
