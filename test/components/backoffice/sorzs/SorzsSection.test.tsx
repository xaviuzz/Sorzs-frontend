import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { SorzsSection } from "@/components/backoffice/sorzs/SorzsSection";
import type { Session } from "@/domain/Session";
import { adminSession } from "../../../support/openSession";

describe("SorzsSection", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows a row per sorz in the order given, with its address in full", async () => {
		sut.answerSorzs([
			{ address: "http://a.com", favicon: null, provider: "generic", users: 1 },
			{
				address: "https://B.com/Docs",
				favicon: null,
				provider: "generic",
				users: 2,
			},
		]);
		sut.show();

		expect(await sut.rows()).toEqual(["http://a.com1", "https://B.com/Docs2"]);
	});

	test("shows the favicon of a sorz that has one", async () => {
		sut.answerSorzs([
			{
				address: "https://a.com",
				favicon: "https://a.com/i.png",
				provider: "generic",
				users: 1,
			},
		]);
		sut.show();

		const favicon = await sut.faviconOf("https://a.com");

		expect(favicon).toHaveAttribute("src", "https://a.com/i.png");
	});

	test("shows the globe when a sorz has no favicon", async () => {
		sut.answerSorzs([
			{
				address: "https://a.com",
				favicon: null,
				provider: "generic",
				users: 1,
			},
		]);
		sut.show();

		expect(await sut.globeOf("https://a.com")).toBeInTheDocument();
	});

	test("names the count of users, in the plural", async () => {
		sut.answerSorzs([
			{
				address: "https://a.com",
				favicon: null,
				provider: "generic",
				users: 2,
			},
		]);
		sut.show();

		expect(await sut.countOf("https://a.com")).toHaveAccessibleName("2 users");
	});

	test("names the count of users, in the singular", async () => {
		sut.answerSorzs([
			{
				address: "https://a.com",
				favicon: null,
				provider: "generic",
				users: 1,
			},
		]);
		sut.show();

		expect(await sut.countOf("https://a.com")).toHaveAccessibleName("1 user");
	});

	test("explains the count with a tooltip", async () => {
		sut.answerSorzs([
			{
				address: "https://a.com",
				favicon: null,
				provider: "generic",
				users: 2,
			},
		]);
		sut.show();

		await userEvent.hover(await sut.countOf("https://a.com"));

		expect(await screen.findByRole("tooltip")).toHaveTextContent("2 users");
	});

	test("offers no buttons and no links on the rows", async () => {
		sut.answerSorzs([
			{
				address: "https://a.com",
				favicon: null,
				provider: "generic",
				users: 1,
			},
		]);
		sut.show();
		const row = await sut.rowOf("https://a.com");

		expect(within(row).queryByRole("button")).not.toBeInTheDocument();
		expect(within(row).queryByRole("link")).not.toBeInTheDocument();
	});

	test("marks a sorz searched by a specific provider", async () => {
		sut.answerSorzs([
			{
				address: "https://reddit.com",
				favicon: null,
				provider: "reddit",
				users: 1,
			},
		]);
		sut.show();

		expect(await sut.markOf("https://reddit.com")).toBeInTheDocument();
	});

	test("does not mark a sorz searched by the generic provider", async () => {
		sut.answerSorzs([
			{
				address: "https://a.com",
				favicon: null,
				provider: "generic",
				users: 1,
			},
		]);
		sut.show();

		await sut.rowOf("https://a.com");
		expect(
			screen.queryByRole("img", { name: "Searched by Reddit" }),
		).toBeNull();
	});

	test("shows every sorz until the toggle is turned on", async () => {
		sut.answerBothKinds();
		sut.show();

		expect(await sut.rows()).toEqual(["https://a.com1", "https://reddit.com1"]);
		expect(await sut.onlyGenericToggle()).not.toBeChecked();
	});

	test("shows only the sorzs with the generic provider when the toggle is on", async () => {
		sut.answerBothKinds();
		sut.show();

		await sut.turnOnlyGenericOn();

		expect(await sut.rows()).toEqual(["https://a.com1"]);
		expect(await sut.onlyGenericToggle()).toBeChecked();
	});

	test("shows every sorz again when the toggle is turned off", async () => {
		sut.answerBothKinds();
		sut.show();
		await sut.turnOnlyGenericOn();

		await userEvent.click(await sut.onlyGenericToggle());

		expect(await sut.rows()).toEqual(["https://a.com1", "https://reddit.com1"]);
	});

	test("shows an empty list when the toggle is on and no sorz has the generic provider", async () => {
		sut.answerSorzs([
			{
				address: "https://reddit.com",
				favicon: null,
				provider: "reddit",
				users: 1,
			},
		]);
		sut.show();

		await sut.turnOnlyGenericOn();

		expect(await sut.list()).toBeEmptyDOMElement();
	});

	test("shows an empty list when no list holds a sorz", async () => {
		sut.answerSorzs([]);
		sut.show();

		expect(await sut.list()).toBeEmptyDOMElement();
	});

	test("shows only the message of a failed read", async () => {
		sut.refuseList("sorzs are down");
		sut.show();

		expect(await sut.failure()).toHaveTextContent("sorzs are down");
		expect(screen.queryByRole("list")).not.toBeInTheDocument();
		expect(screen.queryByRole("switch")).not.toBeInTheDocument();
	});

	test("sends the user to the entry screen on a forbidden answer", async () => {
		sut.forbidList();
		sut.show();

		await waitFor(() => expect(sut.isSessionOpen()).toBe(false));
	});
});

type SorzData = {
	address: string;
	favicon: string | null;
	provider: string;
	users: number;
};

class SUT {
	private answer: () => Response = () => reply("ok", { sorzs: [] });
	private readonly session: Session = adminSession();

	answerSorzs(sorzs: SorzData[]) {
		this.answer = () => reply("ok", { sorzs });
	}

	answerBothKinds() {
		this.answerSorzs([
			{
				address: "https://a.com",
				favicon: null,
				provider: "generic",
				users: 1,
			},
			{
				address: "https://reddit.com",
				favicon: null,
				provider: "reddit",
				users: 1,
			},
		]);
	}

	refuseList(message: string) {
		this.answer = () => reply("error", { code: "INTERNAL_ERROR", message });
	}

	forbidList() {
		this.answer = () => json(403, { code: "FORBIDDEN", message: "forbidden" });
	}

	show() {
		const fetch = async () => this.answer();
		render(
			<ApiProvider
				session={this.session}
				baseUrl="http://localhost"
				fetch={fetch}
			>
				<SorzsSection />
			</ApiProvider>,
		);
	}

	async rows() {
		const items = await screen.findAllByRole("listitem");
		return items.map((item) => item.textContent);
	}

	async faviconOf(address: string) {
		const row = await this.rowOf(address);
		return within(row).getByRole("img", { name: /^Favicon of/ });
	}

	async globeOf(address: string) {
		const row = await this.rowOf(address);
		return within(row).getByRole("img", { name: "No favicon" });
	}

	async countOf(address: string) {
		const row = await this.rowOf(address);
		return within(row).getByRole("img", { name: /users?$/ });
	}

	async onlyGenericToggle() {
		return screen.findByRole("switch", { name: "Only generic provider" });
	}

	async turnOnlyGenericOn() {
		await userEvent.click(await this.onlyGenericToggle());
	}

	async markOf(address: string) {
		const row = await this.rowOf(address);
		return within(row).getByRole("img", { name: "Searched by Reddit" });
	}

	async list() {
		return screen.findByRole("list");
	}

	async failure() {
		return screen.findByRole("alert");
	}

	isSessionOpen() {
		return this.session.isOpen();
	}

	async rowOf(address: string) {
		const items = await screen.findAllByRole("listitem");
		const row = items.find((item) => item.textContent?.includes(address));
		return row as HTMLElement;
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
