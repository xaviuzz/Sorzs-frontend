import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { BackofficeScreen } from "@/components/backoffice/BackofficeScreen";
import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import { SessionProvider } from "@/components/session/SessionProvider";
import { sectionAt } from "@/domain/backofficeSections";
import { adminSession, navigationAt } from "../../support/openSession";

describe("BackofficeScreen", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows the backoffice header", () => {
		sut.showAt("/backoffice/users");

		expect(sut.backButton()).toBeInTheDocument();
	});

	test("shows the sources under the title of the Sorzs section", () => {
		sut.showAt("/backoffice/sorzs");

		expect(sut.title()).toHaveTextContent("Sorzs");
		expect(sut.main()).toHaveTextContent("Loading sources");
	});

	test("shows the users under the title of the Users section", () => {
		sut.showAt("/backoffice/users");

		expect(sut.title()).toHaveTextContent("Users");
		expect(sut.main()).toHaveTextContent("Loading users");
	});

	test("offers Users and Sorzs in the side bar, marking the active one", () => {
		sut.showAt("/backoffice/sorzs");

		expect(sut.entryNames()).toEqual(["Users", "Sorzs"]);
		expect(sut.entry("Sorzs")).toHaveAttribute("aria-current", "page");
		expect(sut.entry("Users")).not.toHaveAttribute("aria-current");
	});

	test("choosing an entry changes the path", async () => {
		sut.showAt("/backoffice/users");

		await sut.choose("Sorzs");

		expect(sut.path()).toBe("/backoffice/sorzs");
	});
});

class SUT {
	private navigation = navigationAt("/");

	showAt(path: string) {
		this.navigation = navigationAt(path);
		const section = sectionAt(path);
		const session = adminSession();
		render(
			<ApiProvider
				session={session}
				baseUrl="http://localhost"
				fetch={() => new Promise(() => {})}
			>
				<NavigationProvider navigation={this.navigation}>
					<SessionProvider session={session}>
						<BackofficeScreen section={section} />
					</SessionProvider>
				</NavigationProvider>
			</ApiProvider>,
		);
	}

	async choose(name: string) {
		await userEvent.click(this.entry(name));
	}

	path() {
		return this.navigation.path();
	}

	backButton() {
		return screen.getByRole("button", { name: "Back to Sorzs" });
	}

	title() {
		return screen.getByRole("heading", { level: 2 });
	}

	main() {
		return screen.getByRole("main");
	}

	entry(name: string) {
		return screen.getByRole("button", { name });
	}

	entryNames() {
		const side = screen.getByRole("complementary", { name: "Backoffice" });
		const buttons = side.querySelectorAll("[data-sidebar='menu-button']");
		return Array.from(buttons).map((button) => button.textContent);
	}
}
