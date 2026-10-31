import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { App } from "@/App";
import { ApiProvider } from "@/api/ApiContext";

describe("App", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows the header", () => {
		sut.show();

		expect(sut.banner()).toBeInTheDocument();
	});
});

class SUT {
	show() {
		render(
			<ApiProvider
				baseUrl="http://localhost"
				fetch={() => new Promise(() => {})}
			>
				<App />
			</ApiProvider>,
		);
	}

	banner() {
		return screen.getByRole("banner");
	}
}
