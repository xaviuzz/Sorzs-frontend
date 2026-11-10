import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { SearchBox } from "@/components/search/SearchBox";
import { SearchProvider } from "@/components/search/SearchProvider";
import { SorzsProvider } from "@/components/sorzs/SorzsProvider";
import { openSession } from "../../support/openSession";

describe("SearchBox", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("cannot search while the query is blank", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.show();
		await sut.sorzsListed();

		await sut.write("   ");

		expect(sut.searchButton()).toBeDisabled();
	});

	test("cannot search when the list has no sorzs", async () => {
		sut.hasSorzs([]);
		sut.show();
		await sut.sorzsListed();

		await sut.write("bun");

		expect(sut.searchButton()).toBeDisabled();
	});

	test("cannot search while the sorzs are loading", async () => {
		sut.neverListSorzs();
		sut.show();
		await sut.sorzsListed();

		await sut.write("bun");

		expect(sut.searchButton()).toBeDisabled();
	});

	test("cannot search when the sorzs failed to load", async () => {
		sut.refuseSorzList();
		sut.show();
		await sut.sorzsListed();

		await sut.write("bun");

		expect(sut.searchButton()).toBeDisabled();
	});

	test("can search with a query and sorzs", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.show();
		await sut.sorzsListed();

		await sut.write("bun");

		expect(sut.searchButton()).toBeEnabled();
	});

	test("searches when the button is pressed", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.show();
		await sut.sorzsListed();
		await sut.write("bun");

		await sut.pressSearch();

		expect(await sut.queriesOnceSent(1)).toEqual(["bun"]);
	});

	test("searches when Enter is pressed", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.show();
		await sut.sorzsListed();

		await sut.writeAndPressEnter("bun");

		expect(await sut.queriesOnceSent(1)).toEqual(["bun"]);
	});

	test("sends nothing when Enter is pressed on a blank query", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.show();
		await sut.sorzsListed();

		await sut.writeAndPressEnter("   ");

		expect(sut.queriesSent()).toEqual([]);
	});

	test("keeps the query written after searching", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.show();
		await sut.sorzsListed();
		await sut.write("bun");

		await sut.pressSearch();

		await sut.queriesOnceSent(1);
		expect(sut.queryBox()).toHaveValue("bun");
	});
});

class SUT {
	private names: string[] = [];
	private sent: string[] = [];
	private sorzListAnswer: () => Promise<Response> = async () =>
		reply({ sorzs: this.names.map(entry) });

	hasSorzs(names: string[]) {
		this.names = names;
	}

	neverListSorzs() {
		this.sorzListAnswer = () => new Promise(() => {});
	}

	refuseSorzList() {
		this.sorzListAnswer = async () =>
			reply({ code: "INTERNAL_ERROR", message: "sorzs are down" }, "error");
	}

	show() {
		render(
			<ApiProvider
				session={openSession()}
				baseUrl="http://localhost"
				fetch={this.fetchIt}
			>
				<SorzsProvider>
					<SearchProvider>
						<SearchBox />
					</SearchProvider>
				</SorzsProvider>
			</ApiProvider>,
		);
	}

	async sorzsListed() {
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
		let response: Promise<Response> = Promise.resolve(reply({ results: [] }));
		if (path === "/sorzs.list") {
			this.listed = true;
			response = this.sorzListAnswer();
		} else {
			this.sent.push(call.body.query);
		}
		return response;
	};
}

function entry(name: string) {
	return {
		sorzId: `s-${name}`,
		name,
		address: `https://${name}.com`,
		title: null,
		favicon: null,
	};
}

function reply(body: unknown, status = "ok") {
	const message = { header: { callId: "c", status }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
