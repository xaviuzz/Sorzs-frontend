import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ApiProvider } from "@/api/ApiContext";
import { Header } from "@/components/header/Header";
import { SearchProvider } from "@/components/search/SearchProvider";
import { SourcesProvider } from "@/components/sources/SourcesProvider";

describe("Header", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows the app name with the health mark beside it", () => {
		sut.show();

		expect(sut.banner()).toContainElement(sut.heading());
		expect(sut.banner()).toContainElement(sut.mark());
	});

	test("offers the search box", () => {
		sut.show();

		expect(sut.banner()).toContainElement(sut.searchBox());
	});

	test("offers the Add Sorz button", () => {
		sut.show();

		expect(sut.banner()).toContainElement(sut.addButton());
	});
});

class SUT {
	show() {
		render(
			<ApiProvider
				baseUrl="http://localhost"
				fetch={() => new Promise(() => {})}
			>
				<SourcesProvider>
					<SearchProvider>
						<Header />
					</SearchProvider>
				</SourcesProvider>
			</ApiProvider>,
		);
	}

	banner() {
		return screen.getByRole("banner");
	}

	heading() {
		return screen.getByRole("heading", { name: "Sorzs" });
	}

	searchBox() {
		return screen.getByRole("textbox", { name: "Query" });
	}

	addButton() {
		return screen.getByRole("button", { name: "Add Sorz" });
	}

	mark() {
		return screen.getByRole("status");
	}
}
