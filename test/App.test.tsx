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

	test("shows the main area for the results", () => {
		sut.show();

		expect(sut.main()).toBeInTheDocument();
	});

	test("shows the sources side bar", () => {
		sut.show();

		expect(sut.sideBar()).toBeInTheDocument();
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

	sideBar() {
		return screen.getByRole("complementary", { name: "Sources" });
	}

	main() {
		return screen.getByRole("main");
	}

	banner() {
		return screen.getByRole("banner");
	}
}
