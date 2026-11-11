import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import { ApiProvider } from "@/api/ApiContext";
import { SorzSideBar } from "@/components/sorzs/list/SorzSideBar";
import { SorzsProvider } from "@/components/sorzs/SorzsProvider";
import type { SorzEntryData } from "@/domain/SorzEntry";
import { openSession } from "../../../support/openSession";

describe("SorzSideBar", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("says it is loading while the list is pending", () => {
		sut.show();

		expect(sut.loadingNotice()).toHaveTextContent("Loading sorzs");
	});

	test("shows the names in the order of addition", async () => {
		sut.answerEntries([
			{
				sorzId: "s-2",
				name: "Beta",
				address: "https://b.com",
				title: null,
				favicon: null,
				provider: "generic",
			},
			{
				sorzId: "s-1",
				name: "Alpha",
				address: "https://a.com",
				title: null,
				favicon: null,
				provider: "generic",
			},
		]);

		sut.show();

		expect(await sut.namesOnceListed()).toEqual(["Beta", "Alpha"]);
	});

	test("shows the address of a sorz that has no name", async () => {
		sut.answerEntries([
			{
				sorzId: "s-1",
				name: null,
				address: "https://a.com",
				title: null,
				favicon: null,
				provider: "generic",
			},
		]);

		sut.show();

		expect(await sut.namesOnceListed()).toEqual(["https://a.com"]);
	});

	test("shows the title of the page of a sorz that has no name", async () => {
		sut.answerEntries([
			{
				sorzId: "s-1",
				name: null,
				address: "https://a.com",
				title: "Page of A",
				favicon: null,
				provider: "generic",
			},
		]);

		sut.show();

		expect(await sut.namesOnceListed()).toEqual(["Page of A"]);
	});

	test("shows the favicon of a sorz on the left of its text", async () => {
		sut.answerEntries([
			{
				sorzId: "s-1",
				name: "Alpha",
				address: "https://a.com",
				title: null,
				favicon: "https://a.com/icon.png",
				provider: "generic",
			},
		]);

		sut.show();

		expect(await sut.faviconOnceListed()).toHaveAttribute(
			"src",
			"https://a.com/icon.png",
		);
	});

	test("shows a neutral icon for a sorz that has no favicon", async () => {
		sut.answerEntries([
			{
				sorzId: "s-1",
				name: "Alpha",
				address: "https://a.com",
				title: null,
				favicon: null,
				provider: "generic",
			},
		]);

		sut.show();

		await sut.namesOnceListed();
		expect(sut.favicon()).not.toBeInTheDocument();
		expect(sut.neutralIcon()).toBeInTheDocument();
	});

	test("shows the address of each sorz as its title", async () => {
		sut.answerEntries([
			{
				sorzId: "s-1",
				name: "Alpha",
				address: "https://a.com",
				title: null,
				favicon: null,
				provider: "generic",
			},
		]);

		sut.show();

		expect(await sut.entryOnceListed("Alpha")).toHaveAttribute(
			"title",
			"https://a.com",
		);
	});

	test("marks a sorz searched by a specific provider", async () => {
		sut.answerEntries([
			{
				sorzId: "s-1",
				name: "Alpha",
				address: "https://www.reddit.com/r/spain",
				title: null,
				favicon: null,
				provider: "reddit",
			},
		]);

		sut.show();

		expect(await sut.markOnceListed()).toBeInTheDocument();
	});

	test("does not mark a sorz searched by the generic provider", async () => {
		sut.answerEntries([
			{
				sorzId: "s-1",
				name: "Alpha",
				address: "https://a.com",
				title: null,
				favicon: null,
				provider: "generic",
			},
		]);

		sut.show();

		await sut.namesOnceListed();
		expect(sut.mark()).not.toBeInTheDocument();
	});

	test("says the user has no sorzs yet when the list is empty", async () => {
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

	test("loads once on mount", async () => {
		sut.answerEntries([]);

		sut.show();
		await sut.emptyNoticeOnceListed();

		expect(sut.listsMade()).toBe(1);
	});
});

type Entry = SorzEntryData;

class SUT {
	private answer: () => Promise<Response> = () => new Promise(() => {});
	private lists = 0;

	answerEntries(entries: Entry[]) {
		this.answer = async () => reply("ok", { sorzs: entries });
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
		const fetch = () => {
			this.lists += 1;
			return this.answer();
		};
		render(
			<ApiProvider
				session={openSession()}
				baseUrl="http://localhost"
				fetch={fetch}
			>
				<SorzsProvider>
					<SorzSideBar />
				</SorzsProvider>
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
		return screen
			.getAllByRole("listitem")
			.map((item) => item.querySelector("[title]")?.textContent);
	}

	emptyNotice() {
		return screen.queryByText("You have no sorzs yet");
	}

	entryOnceListed(name: string) {
		return screen.findByText(name);
	}

	faviconOnceListed() {
		return screen.findByRole("img", { name: "Favicon of Alpha" });
	}

	favicon() {
		return screen.queryByRole("img", { name: "Favicon of Alpha" });
	}

	markOnceListed() {
		return screen.findByRole("img", { name: "Searched by Reddit" });
	}

	mark() {
		return screen.queryByRole("img", { name: "Searched by Reddit" });
	}

	neutralIcon() {
		return screen.queryByRole("img", { name: "No favicon" });
	}

	emptyNoticeOnceListed() {
		return screen.findByText("You have no sorzs yet");
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
