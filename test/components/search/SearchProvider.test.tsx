import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { SearchProvider, useSearch } from "@/components/search/SearchProvider";
import { SourcesProvider } from "@/components/sources/SourcesProvider";

describe("SearchProvider", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows nothing before the first search", () => {
		sut.show();

		expect(sut.status()).not.toBeInTheDocument();
		expect(sut.alert()).not.toBeInTheDocument();
		expect(sut.resultSources()).toEqual([]);
	});

	test("shows that it is searching until the answer arrives", async () => {
		sut.show();

		await sut.searchFor("bun");

		expect(await sut.statusOnceShown()).toHaveTextContent("Searching");
	});

	test("shows the results in the order the backend sent them", async () => {
		sut.show();
		await sut.searchFor("bun");

		await sut.answer("bun", ["Beta", "Alpha"]);

		expect(await sut.resultSourcesOnceShown(2)).toEqual(["Beta", "Alpha"]);
		expect(sut.status()).not.toBeInTheDocument();
	});

	test("shows why the search failed when the backend refuses it", async () => {
		sut.show();
		await sut.searchFor("bun");

		await sut.refuse("bun", "query is too long");

		expect(await sut.alertOnceShown()).toHaveTextContent("query is too long");
	});

	test("shows why the search failed when the network is down", async () => {
		sut.show();
		await sut.searchFor("bun");

		await sut.failNetwork("bun");

		expect(await sut.alertOnceShown()).toHaveTextContent("network down");
	});

	test("keeps the query written after searching", async () => {
		sut.show();
		await sut.searchFor("bun");

		await sut.answer("bun", ["Alpha"]);

		await sut.resultSourcesOnceShown(1);
		expect(sut.queryBox()).toHaveValue("bun");
	});

	test("keeps the results until the next search starts", async () => {
		sut.show();
		await sut.searchFor("bun");
		await sut.answer("bun", ["Alpha"]);
		await sut.resultSourcesOnceShown(1);

		await sut.writeQuery("react");

		expect(sut.resultSources()).toEqual(["Alpha"]);
	});

	test("discards the answer of a search that a newer one superseded", async () => {
		sut.show();
		await sut.searchFor("bun");
		await sut.searchFor("react");

		await sut.answer("react", ["Beta"]);
		await sut.answer("bun", ["Alpha"]);

		expect(await sut.resultSourcesOnceShown(1)).toEqual(["Beta"]);
		await sut.settled();
		expect(sut.resultSources()).toEqual(["Beta"]);
	});

	test("discards the failure of a search that a newer one superseded", async () => {
		sut.show();
		await sut.searchFor("bun");
		await sut.searchFor("react");

		await sut.answer("react", ["Beta"]);
		await sut.refuse("bun", "old failure");

		expect(await sut.resultSourcesOnceShown(1)).toEqual(["Beta"]);
		await sut.settled();
		expect(sut.alert()).not.toBeInTheDocument();
	});

	test("needs its provider to search", () => {
		expect(() => sut.showWithoutProvider()).toThrow("SearchProvider");
	});
});

function Reader() {
	const search = useSearch();
	function writeIt(event: React.ChangeEvent<HTMLInputElement>) {
		search.write(event.target.value);
	}
	return (
		<>
			<input aria-label="Query" value={search.query} onChange={writeIt} />
			<button type="button" onClick={search.run}>
				Search
			</button>
			{search.reading.view()}
		</>
	);
}

type Pending = {
	query: string;
	resolve: (response: Response) => void;
	reject: (error: Error) => void;
};

class SUT {
	private pending: Pending[] = [];

	show() {
		render(
			<ApiProvider baseUrl="http://localhost" fetch={this.fetchIt}>
				<SourcesProvider>
					<SearchProvider>
						<Reader />
					</SearchProvider>
				</SourcesProvider>
			</ApiProvider>,
		);
	}

	showWithoutProvider() {
		const silenced = console.error;
		console.error = () => {};
		try {
			render(<Reader />);
		} finally {
			console.error = silenced;
		}
	}

	async searchFor(query: string) {
		await this.writeQuery(query);
		await userEvent.click(screen.getByRole("button", { name: "Search" }));
	}

	async writeQuery(query: string) {
		await userEvent.clear(this.queryBox());
		await userEvent.type(this.queryBox(), query);
	}

	async answer(query: string, sources: string[]) {
		const results = sources.map((source) => ({
			title: "Search it on Google",
			url: `https://www.google.com/search?q=${query}`,
			description: `Google search for «${query}»`,
			source,
		}));
		await this.reply(query, ok({ results }));
	}

	async refuse(query: string, message: string) {
		await this.reply(query, ok({ code: "INVALID_BODY", message }, "error"));
	}

	async failNetwork(query: string) {
		const call = await this.pendingFor(query);
		call.reject(new TypeError("network down"));
	}

	async settled() {
		await new Promise((resolve) => setTimeout(resolve, 20));
	}

	queryBox() {
		return screen.getByRole("textbox", { name: "Query" });
	}

	status() {
		return screen.queryByRole("status");
	}

	statusOnceShown() {
		return screen.findByRole("status");
	}

	alert() {
		return screen.queryByRole("alert");
	}

	alertOnceShown() {
		return screen.findByRole("alert");
	}

	resultSources() {
		const items = screen.queryAllByRole("listitem");
		return items.map((item) => item.querySelector("a span")?.textContent);
	}

	async resultSourcesOnceShown(count: number) {
		await waitFor(() =>
			expect(screen.getAllByRole("listitem")).toHaveLength(count),
		);
		return this.resultSources();
	}

	private fetchIt = (request: Request) => {
		return new Promise<Response>((resolve, reject) => {
			request.json().then((call) => {
				if (call.body === undefined) {
					resolve(ok({ sources: [] }));
				} else {
					this.pending.push({ query: call.body.query, resolve, reject });
				}
			});
		});
	};

	private async reply(query: string, response: Response) {
		const call = await this.pendingFor(query);
		call.resolve(response);
	}

	private async pendingFor(query: string) {
		await waitFor(() =>
			expect(this.pending.some((call) => call.query === query)).toBe(true),
		);
		const index = this.pending.findIndex((call) => call.query === query);
		const [call] = this.pending.splice(index, 1);
		return call as Pending;
	}
}

function ok(body: unknown, status = "ok") {
	const message = { header: { callId: "c", status }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
