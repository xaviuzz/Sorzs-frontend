import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider, useListSources } from "@/api/ApiContext";
import { SessionProvider } from "@/components/session/SessionProvider";
import { Session } from "@/domain/Session";
import { InMemoryTokenStore } from "../../support/InMemoryTokenStore";

describe("SessionProvider", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows the login screen and not the app while there is no token", () => {
		sut.show();

		expect(sut.loginButton()).toBeInTheDocument();
		expect(sut.app()).not.toBeInTheDocument();
	});

	test("shows the app and not the login screen when a token is stored", () => {
		sut.startWithStored("t-1");
		sut.show();

		expect(sut.app()).toBeInTheDocument();
		expect(sut.loginButton()).not.toBeInTheDocument();
	});

	test("shows the app after a good login and keeps the token", async () => {
		sut.answerToken("t-2");
		sut.show();

		await sut.logIn("xaviuzz", "p1casso");

		expect(await sut.appOnceShown()).toBeInTheDocument();
		expect(sut.storedText()).toBe("t-2");
	});

	test("stays on the login screen with the refusal under the form after a bad login", async () => {
		sut.answerLoginRefused("username or password is wrong");
		sut.show();

		await sut.logIn("xaviuzz", "nope");

		expect(await sut.refusal()).toHaveTextContent(
			"username or password is wrong",
		);
		expect(sut.app()).not.toBeInTheDocument();
	});

	test("returns to the login screen without a message when the API answers 403", async () => {
		sut.startWithStored("t-1");
		sut.answerForbidden();
		sut.show();

		await sut.loadSources();

		expect(await sut.loginButtonOnceShown()).toBeInTheDocument();
		expect(sut.app()).not.toBeInTheDocument();
		expect(sut.noRefusal()).not.toBeInTheDocument();
	});

	test("forgets the stored token when the API answers 403", async () => {
		sut.startWithStored("t-1");
		sut.answerForbidden();
		sut.show();

		await sut.loadSources();

		await sut.loginButtonOnceShown();
		expect(sut.storedText()).toBe("");
	});
});

function Probe() {
	const listSources = useListSources();
	async function load() {
		try {
			await listSources.run();
		} catch {
			return;
		}
	}
	return (
		<>
			<p>The app</p>
			<button type="button" onClick={load}>
				Load
			</button>
		</>
	);
}

class SUT {
	private store = new InMemoryTokenStore();
	private session = new Session(this.store);
	private answers: Record<string, () => Response> = {
		"/auth.login": () => reply({ token: "t-0" }),
		"/sources.list": () => reply({ sources: [] }),
	};

	startWithStored(text: string) {
		this.store = new InMemoryTokenStore(text);
		this.session = new Session(this.store);
	}

	answerToken(token: string) {
		this.answers["/auth.login"] = () => reply({ token });
	}

	answerLoginRefused(message: string) {
		this.answers["/auth.login"] = () =>
			reply({ code: "INVALID_CREDENTIALS", message }, "error");
	}

	answerForbidden() {
		this.answers["/sources.list"] = () =>
			json(403, { code: "FORBIDDEN", message: "forbidden" });
	}

	show() {
		const fetch = async (request: Request) => {
			const answer = this.answers[new URL(request.url).pathname];
			return answer();
		};
		render(
			<ApiProvider
				baseUrl="http://localhost"
				session={this.session}
				fetch={fetch}
			>
				<SessionProvider session={this.session}>
					<Probe />
				</SessionProvider>
			</ApiProvider>,
		);
	}

	async logIn(username: string, password: string) {
		await userEvent.type(screen.getByLabelText("Username"), username);
		await userEvent.type(screen.getByLabelText("Password"), password);
		await userEvent.click(screen.getByRole("button", { name: "Enter" }));
	}

	async loadSources() {
		await userEvent.click(screen.getByRole("button", { name: "Load" }));
	}

	loginButton() {
		return screen.queryByRole("button", { name: "Enter" });
	}

	loginButtonOnceShown() {
		return screen.findByRole("button", { name: "Enter" });
	}

	app() {
		return screen.queryByText("The app");
	}

	appOnceShown() {
		return screen.findByText("The app");
	}

	refusal() {
		return screen.findByRole("alert");
	}

	noRefusal() {
		return screen.queryByRole("alert");
	}

	storedText() {
		return this.store.read().text();
	}
}

function reply(body: unknown, status = "ok") {
	return json(200, { header: { callId: "c", status }, body });
}

function json(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json" },
	});
}
