import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { UsersSection } from "@/components/backoffice/users/UsersSection";
import type { Session } from "@/domain/Session";
import { adminSession } from "../../../support/openSession";

describe("UsersSection", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows every user with the role and the one button that applies", async () => {
		sut.show();

		expect(await sut.rowOf("xaviuzz")).toHaveTextContent("admin");
		expect(sut.changeOf("xaviuzz")).toHaveAccessibleName("Make user");
		expect(await sut.rowOf("ana")).toHaveTextContent("user");
		expect(sut.changeOf("ana")).toHaveAccessibleName("Make admin");
		expect(await sut.names()).toEqual(["xaviuzz", "ana"]);
	});

	test("shows only the message of a failed read", async () => {
		sut.refuseList("users are down");
		sut.show();

		expect(await sut.failure()).toHaveTextContent("users are down");
		expect(sut.addButton()).not.toBeInTheDocument();
	});

	test("offers an icon-only Add user button with a tooltip", async () => {
		sut.show();
		await sut.rowOf("ana");

		await userEvent.hover(sut.addButton() as HTMLElement);

		expect(sut.addButton()).toHaveAccessibleName("Add user");
		expect(await screen.findByRole("tooltip")).toHaveTextContent("Add user");
	});

	test("adds a user from the dialog, closes it and shows the row", async () => {
		sut.show();
		await sut.rowOf("ana");

		await sut.add("bea", "secret", "admin");

		expect(sut.dialog()).not.toBeInTheDocument();
		expect(await sut.rowOf("bea")).toHaveTextContent("admin");
		expect(sut.addPosted()).toEqual({
			username: "bea",
			password: "secret",
			role: "admin",
		});
	});

	test("makes a user a user by default", async () => {
		sut.show();
		await sut.rowOf("ana");

		await sut.add("cai", "secret");

		expect(await sut.rowOf("cai")).toHaveTextContent("user");
		expect(sut.addPosted()).toEqual({
			username: "cai",
			password: "secret",
			role: "user",
		});
	});

	test("empties the form whenever the dialog closes", async () => {
		sut.show();
		await sut.rowOf("ana");
		await sut.openDialog();
		await sut.fill("bea", "secret");

		await sut.cancel();
		await sut.openDialog();

		expect(sut.usernameField()).toHaveValue("");
		expect(sut.passwordField()).toHaveValue("");
		expect(sut.roleChoice("user")).toBeChecked();
	});

	test("shows a refusal inside the dialog and keeps it open", async () => {
		sut.refuseAdd("USERNAME_TAKEN", "that username is already taken");
		sut.show();
		await sut.rowOf("ana");

		await sut.add("ana", "secret");

		expect(await sut.dialogMessage()).toHaveTextContent(
			"that username is already taken",
		);
		expect(sut.dialog()).toBeInTheDocument();
	});

	test("changes the role of a row at once", async () => {
		sut.show();
		await sut.rowOf("ana");

		await sut.change("ana");

		await waitFor(() =>
			expect(sut.changeOf("ana")).toHaveAccessibleName("Make user"),
		);
		expect(await sut.rowOf("ana")).toHaveTextContent("admin");
		expect(sut.roleSetPosted()).toEqual({ username: "ana", role: "admin" });
	});

	test("shows a refusal to change a role beside the row", async () => {
		sut.refuseSetRole("LAST_ADMIN", "the last admin cannot be made a user");
		sut.show();
		await sut.rowOf("xaviuzz");

		await sut.change("xaviuzz");

		expect(await sut.messageOf("xaviuzz")).toHaveTextContent(
			"the last admin cannot be made a user",
		);
		expect(sut.changeOf("xaviuzz")).toHaveAccessibleName("Make user");
	});

	test("sends the user to the entry screen on a forbidden answer", async () => {
		sut.forbidList();
		sut.show();

		await waitFor(() => expect(sut.isSessionOpen()).toBe(false));
	});
});

type UserData = { username: string; role: string };

class SUT {
	private users: UserData[] = [
		{ username: "xaviuzz", role: "admin" },
		{ username: "ana", role: "user" },
	];
	private listAnswer: () => Response | Promise<Response> = () =>
		reply("ok", { users: this.users });
	private addRefusal: { code: string; message: string } | undefined;
	private setRoleRefusal: { code: string; message: string } | undefined;
	private added: unknown;
	private roleSet: unknown;
	private readonly session: Session = adminSession();

	refuseList(message: string) {
		this.listAnswer = () => reply("error", { code: "INTERNAL_ERROR", message });
	}

	forbidList() {
		this.listAnswer = () =>
			json(403, { code: "FORBIDDEN", message: "forbidden" });
	}

	refuseAdd(code: string, message: string) {
		this.addRefusal = { code, message };
	}

	refuseSetRole(code: string, message: string) {
		this.setRoleRefusal = { code, message };
	}

	show() {
		const fetch = async (request: Request) => {
			const call = await request.json();
			return this.route(new URL(request.url).pathname, call.body);
		};
		render(
			<ApiProvider
				session={this.session}
				baseUrl="http://localhost"
				fetch={fetch}
			>
				<UsersSection />
			</ApiProvider>,
		);
	}

	async rowOf(username: string) {
		return (await screen.findByText(username)).closest("li") as HTMLElement;
	}

	async names() {
		const items = await screen.findAllByRole("listitem");
		return items.map((item) => item.firstElementChild?.textContent);
	}

	changeOf(username: string) {
		const row = screen.getByText(username).closest("li") as HTMLElement;
		return within(row).getByRole("button");
	}

	async change(username: string) {
		await userEvent.click(this.changeOf(username));
	}

	async messageOf(username: string) {
		const row = await this.rowOf(username);
		return within(row).findByRole("alert");
	}

	async failure() {
		return screen.findByRole("alert");
	}

	addButton() {
		return screen.queryByRole("button", { name: "Add user" });
	}

	dialog() {
		return screen.queryByRole("dialog");
	}

	async dialogMessage() {
		return within(screen.getByRole("dialog")).findByRole("alert");
	}

	usernameField() {
		return screen.getByLabelText("Username");
	}

	passwordField() {
		return screen.getByLabelText("Password");
	}

	roleChoice(role: string) {
		return screen.getByRole("radio", { name: role });
	}

	async openDialog() {
		await userEvent.click(screen.getByRole("button", { name: "Add user" }));
	}

	async fill(username: string, password: string, role?: string) {
		await userEvent.type(this.usernameField(), username);
		await userEvent.type(this.passwordField(), password);
		if (role !== undefined) {
			await userEvent.click(this.roleChoice(role));
		}
	}

	async cancel() {
		await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
	}

	async add(username: string, password: string, role?: string) {
		await this.openDialog();
		await this.fill(username, password, role);
		await userEvent.click(screen.getByRole("button", { name: "Add" }));
	}

	addPosted() {
		return this.added;
	}

	roleSetPosted() {
		return this.roleSet;
	}

	isSessionOpen() {
		return this.session.isOpen();
	}

	private route(path: string, body: unknown) {
		let answer: Response | Promise<Response> = this.listAnswer();
		if (path === "/users.add") {
			answer = this.addAnswer(body as UserData & { password: string });
		}
		if (path === "/users.setRole") {
			answer = this.setRoleAnswer(body as UserData);
		}
		return answer;
	}

	private addAnswer(body: UserData & { password: string }) {
		this.added = body;
		let answer = reply("error", this.addRefusal);
		if (this.addRefusal === undefined) {
			const user = { username: body.username, role: body.role };
			this.users = [...this.users, user];
			answer = reply("ok", user);
		}
		return answer;
	}

	private setRoleAnswer(body: UserData) {
		this.roleSet = body;
		let answer = reply("error", this.setRoleRefusal);
		if (this.setRoleRefusal === undefined) {
			answer = reply("ok", body);
		}
		return answer;
	}
}

function reply(status: string, body: unknown) {
	return json(200, { header: { callId: "c", status }, body });
}

function json(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json" },
	});
}
