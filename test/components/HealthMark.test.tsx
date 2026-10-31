import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ApiProvider } from "@/api/ApiContext";
import { HealthMark } from "@/components/HealthMark";

describe("HealthMark", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("is neutral while the check is pending", () => {
		sut.show();

		expect(sut.mark()).toHaveAccessibleName("Checking service");
	});

	test("turns into a green check when the service is ok", async () => {
		sut.answerOk();

		sut.show();

		expect(await sut.markOnceUp()).toHaveClass("text-ok");
	});

	test("turns into a red cross when the check fails", async () => {
		sut.fail();

		sut.show();

		expect(await sut.markOnceDown()).toHaveClass("text-error");
	});

	test("needs a api provider", () => {
		expect(() => sut.showWithoutProvider()).toThrow("ApiProvider");
	});

	test("checks once on load", async () => {
		sut.answerOk();

		sut.show();
		await sut.markOnceUp();

		expect(sut.checksMade()).toBe(1);
	});
});

class SUT {
	private answer: () => Promise<Response> = () => new Promise(() => {});
	private checks = 0;

	answerOk() {
		this.answer = async () => okReply();
	}

	fail() {
		this.answer = async () => {
			throw new TypeError("network down");
		};
	}

	show() {
		const fetch = () => {
			this.checks += 1;
			return this.answer();
		};
		render(
			<ApiProvider baseUrl="http://localhost" fetch={fetch}>
				<HealthMark />
			</ApiProvider>,
		);
	}

	showWithoutProvider() {
		const silenced = console.error;
		console.error = () => {};
		try {
			render(<HealthMark />);
		} finally {
			console.error = silenced;
		}
	}

	mark() {
		return screen.getByRole("status");
	}

	markOnceUp() {
		return screen.findByRole("status", { name: "Service is up" });
	}

	markOnceDown() {
		return screen.findByRole("status", { name: "Service is down" });
	}

	checksMade() {
		return this.checks;
	}
}

function okReply() {
	const body = {
		header: { callId: "c", status: "ok" },
		body: { status: "ok" },
	};
	return new Response(JSON.stringify(body), {
		headers: { "content-type": "application/json" },
	});
}
