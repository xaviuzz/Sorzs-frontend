import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { LogoutButton } from "@/components/header/LogoutButton";
import { SessionProvider } from "@/components/session/SessionProvider";
import { SourcesProvider } from "@/components/sources/SourcesProvider";
import { Session } from "@/domain/Session";
import { InMemoryTokenStore } from "../../support/InMemoryTokenStore";

describe("LogoutButton", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("is an icon button named Log out", async () => {
		sut.show();

		const button = await sut.button();

		expect(button).toBeInTheDocument();
		expect(button.textContent).toBe("");
	});

	test("returns to the login screen with no message when pressed", async () => {
		sut.show();
		await sut.listRead(1);

		await sut.press();

		expect(sut.loginButton()).toBeInTheDocument();
		expect(sut.logoutButton()).not.toBeInTheDocument();
		expect(sut.noRefusal()).not.toBeInTheDocument();
	});

	test("forgets the stored token when pressed", async () => {
		sut.show();
		await sut.listRead(1);

		await sut.press();

		expect(sut.storedText()).toBe("");
	});

	test("reads the list again at the next login", async () => {
		sut.show();
		await sut.listRead(1);
		await sut.press();

		await sut.logIn("ana", "pueblos");

		await sut.listRead(2);
	});
});

class SUT {
	private store = new InMemoryTokenStore("t-1");
	private session = new Session(this.store);
	private reads = 0;

	show() {
		const fetch = async (request: Request) => {
			const path = new URL(request.url).pathname;
			if (path === "/sources.list") {
				this.reads += 1;
				return reply({ sources: [] });
			}
			return reply({ token: "t-2" });
		};
		render(
			<ApiProvider
				baseUrl="http://localhost"
				session={this.session}
				fetch={fetch}
			>
				<SessionProvider session={this.session}>
					<SourcesProvider>
						<LogoutButton />
					</SourcesProvider>
				</SessionProvider>
			</ApiProvider>,
		);
	}

	async press() {
		await userEvent.click(screen.getByRole("button", { name: "Log out" }));
	}

	async logIn(username: string, password: string) {
		await userEvent.type(screen.getByLabelText("Username"), username);
		await userEvent.type(screen.getByLabelText("Password"), password);
		await userEvent.click(screen.getByRole("button", { name: "Enter" }));
	}

	async listRead(times: number) {
		await waitFor(() => expect(this.reads).toBe(times));
	}

	button() {
		return screen.findByRole("button", { name: "Log out" });
	}

	logoutButton() {
		return screen.queryByRole("button", { name: "Log out" });
	}

	loginButton() {
		return screen.queryByRole("button", { name: "Enter" });
	}

	noRefusal() {
		return screen.queryByRole("alert");
	}

	storedText() {
		return this.store.read().text();
	}
}

function reply(body: unknown) {
	const message = { header: { callId: "c", status: "ok" }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
