import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ApiProvider } from "@/api/ApiContext";
import { Header } from "@/components/header/Header";
import { SearchProvider } from "@/components/search/SearchProvider";
import { SessionProvider } from "@/components/session/SessionProvider";
import { SourcesProvider } from "@/components/sources/SourcesProvider";
import { openSession } from "../../support/openSession";

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

	test("offers the Log out button after the Add Sorz button", () => {
		sut.show();

		expect(sut.banner()).toContainElement(sut.logoutButton());
		expect(sut.addButton().compareDocumentPosition(sut.logoutButton())).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);
	});
});

class SUT {
	show() {
		const session = openSession();
		render(
			<ApiProvider
				session={session}
				baseUrl="http://localhost"
				fetch={() => new Promise(() => {})}
			>
				<SessionProvider session={session}>
					<SourcesProvider>
						<SearchProvider>
							<Header />
						</SearchProvider>
					</SourcesProvider>
				</SessionProvider>
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

	logoutButton() {
		return screen.getByRole("button", { name: "Log out" });
	}

	mark() {
		return screen.getByRole("status");
	}
}
