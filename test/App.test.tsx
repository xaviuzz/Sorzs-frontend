import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";
import { ApiProvider } from "@/api/ApiContext";
import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import { SessionProvider } from "@/components/session/SessionProvider";
import type { Navigation } from "@/domain/Navigation";
import type { Session } from "@/domain/Session";
import { adminSession, navigationAt, openSession } from "./support/openSession";

describe("App", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows the header", () => {
		sut.show(openSession(), "/");

		expect(sut.banner()).toBeInTheDocument();
	});

	test("shows the main area for the results", () => {
		sut.show(openSession(), "/");

		expect(sut.main()).toBeInTheDocument();
	});

	test("shows the sorzs side bar", () => {
		sut.show(openSession(), "/");

		expect(sut.sideBar()).toBeInTheDocument();
	});

	test("shows the backoffice at its path to an admin", () => {
		sut.show(adminSession(), "/backoffice/sorzs");

		expect(sut.title()).toHaveTextContent("Sorzs");
		expect(sut.backoffice()).toBeInTheDocument();
	});

	test("sends /backoffice to Users", () => {
		sut.show(adminSession(), "/backoffice");

		expect(sut.title()).toHaveTextContent("Users");
		expect(sut.path()).toBe("/backoffice/users");
	});

	test("sends a user who is not an admin from /backoffice to Sorzs", () => {
		sut.show(openSession(), "/backoffice");

		expect(sut.sideBar()).toBeInTheDocument();
		expect(sut.path()).toBe("/");
	});

	test("shows another section when its entry is chosen", async () => {
		sut.show(adminSession(), "/backoffice/users");

		await sut.choose("Sorzs");

		expect(sut.title()).toHaveTextContent("Sorzs");
		expect(sut.entry("Sorzs")).toHaveAttribute("aria-current", "page");
	});

	test("enters the backoffice from the header and goes back", async () => {
		sut.show(adminSession(), "/");

		await sut.press("Backoffice");
		expect(sut.title()).toHaveTextContent("Users");

		await sut.press("Back to Sorzs");
		expect(sut.sideBar()).toBeInTheDocument();
	});
});

class SUT {
	private navigation: Navigation = navigationAt("/");

	show(session: Session, path: string) {
		this.navigation = navigationAt(path);
		render(
			<ApiProvider
				session={session}
				baseUrl="http://localhost"
				fetch={() => new Promise(() => {})}
			>
				<NavigationProvider navigation={this.navigation}>
					<SessionProvider session={session}>
						<App />
					</SessionProvider>
				</NavigationProvider>
			</ApiProvider>,
		);
	}

	async choose(name: string) {
		await userEvent.click(this.entry(name));
	}

	async press(name: string) {
		await userEvent.click(screen.getByRole("button", { name }));
	}

	path() {
		return this.navigation.path();
	}

	sideBar() {
		return screen.getByRole("complementary", { name: "Sorzs" });
	}

	backoffice() {
		return screen.getByRole("complementary", { name: "Backoffice" });
	}

	entry(name: string) {
		return screen.getByRole("button", { name });
	}

	title() {
		return screen.getByRole("heading", { level: 2 });
	}

	main() {
		return screen.getByRole("main");
	}

	banner() {
		return screen.getByRole("banner");
	}
}
