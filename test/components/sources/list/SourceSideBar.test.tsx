import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import { ApiProvider } from "@/api/ApiContext";
import { SourceSideBar } from "@/components/sources/list/SourceSideBar";
import { SourcesProvider } from "@/components/sources/SourcesProvider";
import type { SourceEntryData } from "@/domain/SourceEntry";
import { openSession } from "../../../support/openSession";

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
			{
				sourceId: "s-2",
				name: "Beta",
				address: "https://b.com",
				title: null,
				favicon: null,
			},
			{
				sourceId: "s-1",
				name: "Alpha",
				address: "https://a.com",
				title: null,
				favicon: null,
			},
		]);

		sut.show();

		expect(await sut.namesOnceListed()).toEqual(["Beta", "Alpha"]);
	});

	test("shows the address of a source that has no name", async () => {
		sut.answerEntries([
			{
				sourceId: "s-1",
				name: null,
				address: "https://a.com",
				title: null,
				favicon: null,
			},
		]);

		sut.show();

		expect(await sut.namesOnceListed()).toEqual(["https://a.com"]);
	});

	test("shows the title of the page of a source that has no name", async () => {
		sut.answerEntries([
			{
				sourceId: "s-1",
				name: null,
				address: "https://a.com",
				title: "Page of A",
				favicon: null,
			},
		]);

		sut.show();

		expect(await sut.namesOnceListed()).toEqual(["Page of A"]);
	});

	test("shows the favicon of a source on the left of its text", async () => {
		sut.answerEntries([
			{
				sourceId: "s-1",
				name: "Alpha",
				address: "https://a.com",
				title: null,
				favicon: "https://a.com/icon.png",
			},
		]);

		sut.show();

		expect(await sut.faviconOnceListed()).toHaveAttribute(
			"src",
			"https://a.com/icon.png",
		);
	});

	test("shows a neutral icon for a source that has no favicon", async () => {
		sut.answerEntries([
			{
				sourceId: "s-1",
				name: "Alpha",
				address: "https://a.com",
				title: null,
				favicon: null,
			},
		]);

		sut.show();

		await sut.namesOnceListed();
		expect(sut.favicon()).not.toBeInTheDocument();
		expect(sut.neutralIcon()).toBeInTheDocument();
	});

	test("shows the address of each source as its title", async () => {
		sut.answerEntries([
			{
				sourceId: "s-1",
				name: "Alpha",
				address: "https://a.com",
				title: null,
				favicon: null,
			},
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

	test("loads once on mount", async () => {
		sut.answerEntries([]);

		sut.show();
		await sut.emptyNoticeOnceListed();

		expect(sut.listsMade()).toBe(1);
	});
});

type Entry = SourceEntryData;

class SUT {
	private answer: () => Promise<Response> = () => new Promise(() => {});
	private lists = 0;

	answerEntries(entries: Entry[]) {
		this.answer = async () => reply("ok", { sources: entries });
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
				<SourcesProvider>
					<SourceSideBar />
				</SourcesProvider>
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
		return screen.queryByText("You have no sources yet");
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

	neutralIcon() {
		return screen.queryByRole("img", { name: "No favicon" });
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
