import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ApiProvider } from "@/api/ApiContext";
import { SessionProvider } from "@/components/session/SessionProvider";
import { closedSession } from "../../support/openSession";

describe("LoginScreen", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
		sut.show();
	});

	test("shows the brand", () => {
		expect(sut.brand()).toBeInTheDocument();
	});

	test("shows the username and password fields and the button", () => {
		expect(sut.usernameField()).toBeInTheDocument();
		expect(sut.passwordField()).toBeInTheDocument();
		expect(sut.enterButton()).toBeInTheDocument();
	});

	test("shows nothing of Sorzs besides the form", () => {
		expect(sut.header()).not.toBeInTheDocument();
		expect(sut.sideBar()).not.toBeInTheDocument();
		expect(sut.healthMark()).not.toBeInTheDocument();
	});
});

class SUT {
	show() {
		const session = closedSession();
		render(
			<ApiProvider
				baseUrl="http://localhost"
				session={session}
				fetch={() => new Promise(() => {})}
			>
				<SessionProvider session={session}>
					<p>The app</p>
				</SessionProvider>
			</ApiProvider>,
		);
	}

	brand() {
		return screen.getByRole("heading", { name: "Sorzs" });
	}

	usernameField() {
		return screen.getByLabelText("Username");
	}

	passwordField() {
		return screen.getByLabelText("Password");
	}

	enterButton() {
		return screen.getByRole("button", { name: "Enter" });
	}

	header() {
		return screen.queryByRole("banner");
	}

	sideBar() {
		return screen.queryByRole("complementary");
	}

	healthMark() {
		return screen.queryByRole("status");
	}
}
