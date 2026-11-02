import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { BackofficeHeader } from "@/components/header/BackofficeHeader";
import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import { SessionProvider } from "@/components/session/SessionProvider";
import { adminSession, navigationAt } from "../../support/openSession";

describe("BackofficeHeader", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
		sut.show();
	});

	test("shows the app name, which is not a link, with the health mark", () => {
		expect(sut.banner()).toContainElement(sut.heading());
		expect(sut.banner()).toContainElement(sut.mark());
		expect(sut.brandLink()).not.toBeInTheDocument();
	});

	test("offers the Back to Sorzs and Log out buttons", () => {
		expect(sut.banner()).toContainElement(sut.backButton());
		expect(sut.banner()).toContainElement(sut.logoutButton());
		expect(sut.backButton().textContent).toBe("");
	});

	test("has no search box and no add button", () => {
		expect(sut.searchBox()).not.toBeInTheDocument();
		expect(sut.addButton()).not.toBeInTheDocument();
	});

	test("goes back to Sorzs when the Back to Sorzs button is pressed", async () => {
		await sut.pressBack();

		expect(sut.path()).toBe("/");
	});
});

class SUT {
	private readonly navigation = navigationAt("/backoffice/users");

	show() {
		const session = adminSession();
		render(
			<ApiProvider
				session={session}
				baseUrl="http://localhost"
				fetch={() => new Promise(() => {})}
			>
				<NavigationProvider navigation={this.navigation}>
					<SessionProvider session={session}>
						<BackofficeHeader />
					</SessionProvider>
				</NavigationProvider>
			</ApiProvider>,
		);
	}

	async pressBack() {
		await userEvent.click(this.backButton());
	}

	path() {
		return this.navigation.path();
	}

	banner() {
		return screen.getByRole("banner");
	}

	heading() {
		return screen.getByRole("heading", { name: "Sorzs" });
	}

	mark() {
		return screen.getByRole("status");
	}

	brandLink() {
		return screen.queryByRole("link");
	}

	backButton() {
		return screen.getByRole("button", { name: "Back to Sorzs" });
	}

	logoutButton() {
		return screen.getByRole("button", { name: "Log out" });
	}

	searchBox() {
		return screen.queryByRole("textbox", { name: "Query" });
	}

	addButton() {
		return screen.queryByRole("button", { name: "Add Sorz" });
	}
}
