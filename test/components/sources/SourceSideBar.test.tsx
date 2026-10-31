import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { SourceSideBar } from "@/components/sources/SourceSideBar";

describe("SourceSideBar", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("says it is loading while the list is pending", () => {
		sut.show();

		expect(sut.loadingNotice()).toHaveTextContent("Loading sources");
	});

	test("shows the names in the order of addition", async () => {
		sut.answerEntries([
			{ sourceId: "s-2", name: "Beta", address: "https://b.com" },
			{ sourceId: "s-1", name: "Alpha", address: "https://a.com" },
		]);

		sut.show();

		expect(await sut.namesOnceListed()).toEqual(["Beta", "Alpha"]);
	});

	test("shows the address of each source as its title", async () => {
		sut.answerEntries([
			{ sourceId: "s-1", name: "Alpha", address: "https://a.com" },
		]);

		sut.show();

		expect(await sut.entryOnceListed("Alpha")).toHaveAttribute(
			"title",
			"https://a.com",
		);
	});

	test("says the user has no sources yet when the list is empty", async () => {
		sut.answerEntries([]);

		sut.show();

		expect(await sut.emptyNoticeOnceListed()).toBeInTheDocument();
	});

	test("shows the refusal message when the list is refused", async () => {
		sut.answerRefusal("INTERNAL_ERROR", "internal error");

		sut.show();

		expect(await sut.errorOnceFailed()).toHaveTextContent("internal error");
	});

	test("shows the failure message when the network fails", async () => {
		sut.failNetwork();

		sut.show();

		expect(await sut.errorOnceFailed()).toHaveTextContent("network down");
	});

	test("appends an added source after the ones already listed", async () => {
		sut.answerEntries([
			{ sourceId: "s-1", name: "Alpha", address: "https://a.com" },
		]);
		sut.answerCreated({
			sourceId: "s-2",
			name: "Beta",
			address: "https://b.com",
		});
		sut.show();
		await sut.namesOnceListed();

		await sut.addSource("https://b.com", "Beta");

		expect(await sut.namesOnceListed(2)).toEqual(["Alpha", "Beta"]);
	});

	test("replaces the empty notice when the first source is added", async () => {
		sut.answerEntries([]);
		sut.answerCreated({
			sourceId: "s-1",
			name: "Alpha",
			address: "https://a.com",
		});
		sut.show();
		await sut.emptyNoticeOnceListed();

		await sut.addSource("https://a.com", "Alpha");

		expect(await sut.namesOnceListed()).toEqual(["Alpha"]);
		expect(sut.emptyNotice()).not.toBeInTheDocument();
	});

	test("loads once on mount", async () => {
		sut.answerEntries([]);

		sut.show();
		await sut.emptyNoticeOnceListed();

		expect(sut.listsMade()).toBe(1);
	});
});

type Entry = { sourceId: string; name: string; address: string };

class SUT {
	private answer: () => Promise<Response> = () => new Promise(() => {});
	private creation: () => Promise<Response> = () => new Promise(() => {});
	private lists = 0;

	answerEntries(entries: Entry[]) {
		this.answer = async () => reply("ok", { sources: entries });
	}

	answerCreated(entry: Entry) {
		this.creation = async () => reply("ok", entry);
	}

	answerRefusal(code: string, message: string) {
		this.answer = async () => reply("error", { code, message });
	}

	failNetwork() {
		this.answer = async () => {
			throw new TypeError("network down");
		};
	}

	show() {
		const fetch = (request: Request) => {
			const path = new URL(request.url).pathname;
			if (path === "/sources.add") {
				return this.creation();
			}
			this.lists += 1;
			return this.answer();
		};
		render(
			<ApiProvider baseUrl="http://localhost" fetch={fetch}>
				<SourceSideBar />
			</ApiProvider>,
		);
	}

	loadingNotice() {
		return screen.getByRole("status");
	}

	async namesOnceListed(count?: number) {
		await screen.findAllByRole("listitem");
		if (count !== undefined) {
			await waitFor(() =>
				expect(screen.getAllByRole("listitem")).toHaveLength(count),
			);
		}
		return screen.getAllByRole("listitem").map((item) => item.textContent);
	}

	async addSource(address: string, name: string) {
		await userEvent.click(screen.getByRole("button", { name: "Add Sorz" }));
		await userEvent.type(
			screen.getByRole("textbox", { name: "Address" }),
			address,
		);
		await userEvent.type(screen.getByRole("textbox", { name: "Name" }), name);
		await userEvent.click(screen.getByRole("button", { name: "Add" }));
	}

	emptyNotice() {
		return screen.queryByText("You have no sources yet");
	}

	entryOnceListed(name: string) {
		return screen.findByText(name);
	}

	emptyNoticeOnceListed() {
		return screen.findByText("You have no sources yet");
	}

	errorOnceFailed() {
		return screen.findByRole("alert");
	}

	listsMade() {
		return this.lists;
	}
}

function reply(status: string, body: unknown) {
	const message = { header: { callId: "c", status }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
