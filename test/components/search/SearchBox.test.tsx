import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { SearchBox } from "@/components/search/SearchBox";
import { SearchProvider } from "@/components/search/SearchProvider";
import { SourcesProvider } from "@/components/sources/SourcesProvider";

describe("SearchBox", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("cannot search while the query is blank", async () => {
		sut.hasSources(["Alpha"]);
		sut.show();
		await sut.sourcesListed();

		await sut.write("   ");

		expect(sut.searchButton()).toBeDisabled();
	});

	test("cannot search when the list has no sources", async () => {
		sut.hasSources([]);
		sut.show();
		await sut.sourcesListed();

		await sut.write("bun");

		expect(sut.searchButton()).toBeDisabled();
	});

	test("can search with a query and sources", async () => {
		sut.hasSources(["Alpha"]);
		sut.show();
		await sut.sourcesListed();

		await sut.write("bun");

		expect(sut.searchButton()).toBeEnabled();
	});

	test("searches when the button is pressed", async () => {
		sut.hasSources(["Alpha"]);
		sut.show();
		await sut.sourcesListed();
		await sut.write("bun");

		await sut.pressSearch();

		expect(await sut.queriesOnceSent(1)).toEqual(["bun"]);
	});

	test("searches when Enter is pressed", async () => {
		sut.hasSources(["Alpha"]);
		sut.show();
		await sut.sourcesListed();

		await sut.writeAndPressEnter("bun");

		expect(await sut.queriesOnceSent(1)).toEqual(["bun"]);
	});

	test("sends nothing when Enter is pressed on a blank query", async () => {
		sut.hasSources(["Alpha"]);
		sut.show();
		await sut.sourcesListed();

		await sut.writeAndPressEnter("   ");

		expect(sut.queriesSent()).toEqual([]);
	});

	test("keeps the query written after searching", async () => {
		sut.hasSources(["Alpha"]);
		sut.show();
		await sut.sourcesListed();
		await sut.write("bun");

		await sut.pressSearch();

		await sut.queriesOnceSent(1);
		expect(sut.queryBox()).toHaveValue("bun");
	});
});

class SUT {
	private names: string[] = [];
	private sent: string[] = [];

	hasSources(names: string[]) {
		this.names = names;
	}

	show() {
		render(
			<ApiProvider baseUrl="http://localhost" fetch={this.fetchIt}>
				<SourcesProvider>
					<SearchProvider>
						<SearchBox />
					</SearchProvider>
				</SourcesProvider>
			</ApiProvider>,
		);
	}

	async sourcesListed() {
		await screen.findByText("Search");
		await waitFor(() => expect(this.listed).toBe(true));
		await this.settled();
	}

	async write(query: string) {
		await userEvent.type(this.queryBox(), query);
	}

	async writeAndPressEnter(query: string) {
		await userEvent.type(this.queryBox(), `${query}{Enter}`);
	}

	async pressSearch() {
		await userEvent.click(this.searchButton());
	}

	queryBox() {
		return screen.getByRole("textbox", { name: "Query" });
	}

	searchButton() {
		return screen.getByRole("button", { name: "Search" });
	}

	queriesSent() {
		return this.sent;
	}

	async queriesOnceSent(count: number) {
		await waitFor(() => expect(this.sent).toHaveLength(count));
		return this.sent;
	}

	private listed = false;

	private async settled() {
		await new Promise((resolve) => setTimeout(resolve, 20));
	}

	private fetchIt = async (request: Request) => {
		const path = new URL(request.url).pathname;
		const call = await request.json();
		let body: unknown = { results: [] };
		if (path === "/sources.list") {
			this.listed = true;
			body = { sources: this.names.map(entry) };
		} else {
			this.sent.push(call.body.query);
		}
		return reply(body);
	};
}

function entry(name: string) {
	return {
		sourceId: `s-${name}`,
		name,
		address: `https://${name}.com`,
		title: null,
		favicon: null,
	};
}

function reply(body: unknown) {
	const message = { header: { callId: "c", status: "ok" }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
