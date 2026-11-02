import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { SessionProvider } from "@/components/session/SessionProvider";
import { closedSession } from "../../support/openSession";

describe("LoginForm", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("hides what is typed in the password field", () => {
		sut.show();

		expect(sut.passwordField()).toHaveAttribute("type", "password");
	});

	test("shows no message before anything is sent", () => {
		sut.show();

		expect(sut.message()).not.toBeInTheDocument();
	});

	test("sends the credentials when Enter is pressed in the password field", async () => {
		sut.show();

		await sut.typeCredentialsAndPressEnter("xaviuzz", "p1casso");

		expect(await sut.sentCredentials()).toEqual({
			username: "xaviuzz",
			password: "p1casso",
		});
	});

	test("sends the credentials when the button is pressed", async () => {
		sut.show();

		await sut.typeCredentialsAndPressButton("xaviuzz", "p1casso");

		expect(await sut.sentCredentials()).toEqual({
			username: "xaviuzz",
			password: "p1casso",
		});
	});

	test("shows the refusal under the form", async () => {
		sut.answerRefusal("username or password is wrong");
		sut.show();

		await sut.typeCredentialsAndPressButton("xaviuzz", "nope");

		expect(await sut.messageOnceShown()).toHaveTextContent(
			"username or password is wrong",
		);
	});

	test("clears the refusal when the credentials are sent again", async () => {
		sut.answerRefusal("username or password is wrong");
		sut.show();
		await sut.typeCredentialsAndPressButton("xaviuzz", "nope");
		await sut.messageOnceShown();

		sut.answerNever();
		await sut.pressButton();

		expect(sut.message()).not.toBeInTheDocument();
	});
});

type Sent = { username: string; password: string };

class SUT {
	private sent: Sent | undefined;
	private answer: () => Promise<Response> = async () =>
		reply({ token: "t-9" }, "ok");

	answerRefusal(message: string) {
		this.answer = async () =>
			reply({ code: "INVALID_CREDENTIALS", message }, "error");
	}

	answerNever() {
		this.answer = () => new Promise(() => {});
	}

	show() {
		const session = closedSession();
		const fetch = async (request: Request) => {
			const call = await request.json();
			this.sent = call.body;
			return this.answer();
		};
		render(
			<ApiProvider baseUrl="http://localhost" session={session} fetch={fetch}>
				<SessionProvider session={session}>
					<p>The app</p>
				</SessionProvider>
			</ApiProvider>,
		);
	}

	async typeCredentialsAndPressEnter(username: string, password: string) {
		await userEvent.type(this.usernameField(), username);
		await userEvent.type(this.passwordField(), `${password}{Enter}`);
	}

	async typeCredentialsAndPressButton(username: string, password: string) {
		await userEvent.type(this.usernameField(), username);
		await userEvent.type(this.passwordField(), password);
		await this.pressButton();
	}

	async pressButton() {
		await userEvent.click(screen.getByRole("button", { name: "Enter" }));
	}

	async sentCredentials() {
		await screen.findByText("The app");
		return this.sent;
	}

	passwordField() {
		return screen.getByLabelText("Password");
	}

	message() {
		return screen.queryByRole("alert");
	}

	messageOnceShown() {
		return screen.findByRole("alert");
	}

	private usernameField() {
		return screen.getByLabelText("Username");
	}
}

function reply(body: unknown, status: string) {
	const message = { header: { callId: "c", status }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
