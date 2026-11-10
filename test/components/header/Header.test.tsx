import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { Header } from "@/components/header/Header";
import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import { SearchProvider } from "@/components/search/SearchProvider";
import { SessionProvider } from "@/components/session/SessionProvider";
import { SorzsProvider } from "@/components/sorzs/SorzsProvider";
import type { Session } from "@/domain/Session";
import {
	adminSession,
	navigationAt,
	openSession,
} from "../../support/openSession";

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

	test("offers the Backoffice button to an admin, before the Log out button", () => {
		sut.showToAdmin();

		expect(sut.banner()).toContainElement(sut.backofficeButton());
		expect(sut.backofficeButton().textContent).toBe("");
		expect(
			sut.backofficeButton().compareDocumentPosition(sut.logoutButton()),
		).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
	});

	test("hides the Backoffice button from a user who is not an admin", () => {
		sut.show();

		expect(sut.noBackofficeButton()).not.toBeInTheDocument();
	});

	test("goes to the backoffice when the Backoffice button is pressed", async () => {
		sut.showToAdmin();

		await sut.pressBackoffice();

		expect(sut.path()).toBe("/backoffice/users");
	});
});

class SUT {
	private readonly navigation = navigationAt("/");

	show() {
		this.showTo(openSession());
	}

	showToAdmin() {
		this.showTo(adminSession());
	}

	path() {
		return this.navigation.path();
	}

	async pressBackoffice() {
		await userEvent.click(this.backofficeButton());
	}

	backofficeButton() {
		return screen.getByRole("button", { name: "Backoffice" });
	}

	noBackofficeButton() {
		return screen.queryByRole("button", { name: "Backoffice" });
	}

	private showTo(session: Session) {
		render(
			<ApiProvider
				session={session}
				baseUrl="http://localhost"
				fetch={() => new Promise(() => {})}
			>
				<NavigationProvider navigation={this.navigation}>
					<SessionProvider session={session}>
						<SorzsProvider>
							<SearchProvider>
								<Header />
							</SearchProvider>
						</SorzsProvider>
					</SessionProvider>
				</NavigationProvider>
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
