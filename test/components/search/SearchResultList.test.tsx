import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { SearchBox } from "@/components/search/SearchBox";
import { SearchProvider, useSearch } from "@/components/search/SearchProvider";
import { SearchResultList } from "@/components/search/SearchResultList";
import {
	SourcesProvider,
	useAppendSource,
} from "@/components/sources/SourcesProvider";
import { SourceEntry } from "@/domain/SourceEntry";
import { openSession } from "../../support/openSession";

describe("SearchResultList", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows nothing before the first search", async () => {
		sut.show();
		await sut.sourcesListed();

		expect(sut.links()).toEqual([]);
	});

	test("shows each result with its title, description and source, in order", async () => {
		sut.hasSources(["Alpha", "Beta"]);
		sut.show();
		await sut.sourcesListed();

		await sut.search("bun");

		const links = await sut.linksOnceShown(2);
		expect(links[0]).toHaveTextContent("Search it on Google");
		expect(links[0]).toHaveTextContent(
			"Google search for «bun» limited to Alpha",
		);
		expect(links[0]).toHaveTextContent("Alpha");
		expect(links[1]).toHaveTextContent("Beta");
	});

	test("links to the result address in a new tab", async () => {
		sut.hasSources(["Alpha"]);
		sut.show();
		await sut.sourcesListed();

		await sut.search("bun");

		const [link] = await sut.linksOnceShown(1);
		expect(link).toHaveAttribute(
			"href",
			"https://www.google.com/search?q=bun site:Alpha",
		);
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	test("shows the favicon of the source of each result", async () => {
		sut.hasSources(["Alpha", "Beta"]);
		sut.hasFavicon("Alpha", "https://alpha.com/i.png");
		sut.show();
		await sut.sourcesListed();

		await sut.search("bun");

		await sut.linksOnceShown(2);
		expect(sut.faviconOf("Alpha")).toHaveAttribute(
			"src",
			"https://alpha.com/i.png",
		);
		expect(sut.missingFavicon()).toBeInTheDocument();
	});

	test("shows that it is searching until the answer arrives", async () => {
		sut.hasSources(["Alpha"]);
		sut.neverAnswerSearches();
		sut.show();
		await sut.sourcesListed();

		await sut.search("bun");

		expect(await sut.searchingNotice()).toHaveTextContent("Searching");
	});

	test("shows why the search failed", async () => {
		sut.hasSources(["Alpha"]);
		sut.refuseSearches("query is too long");
		sut.show();
		await sut.sourcesListed();

		await sut.search("bun");

		expect(await sut.failureNotice()).toHaveTextContent("query is too long");
	});

	test("shows a result without favicon while the sources are loading", async () => {
		sut.hasSources(["Alpha"]);
		sut.neverListSources();
		sut.showSearchingWithoutBox();
		await sut.sourcesListed();

		await sut.forceSearch();

		await sut.linksOnceShown(1);
		expect(sut.missingFavicon()).toBeInTheDocument();
	});

	test("shows a result without favicon when the sources failed to load", async () => {
		sut.hasSources(["Alpha"]);
		sut.refuseSourceList();
		sut.showSearchingWithoutBox();
		await sut.sourcesListed();

		await sut.forceSearch();

		await sut.linksOnceShown(1);
		expect(sut.missingFavicon()).toBeInTheDocument();
	});

	test("keeps the results when a source is added afterwards", async () => {
		sut.hasSources(["Alpha"]);
		sut.show();
		await sut.sourcesListed();
		await sut.search("bun");
		await sut.linksOnceShown(1);

		await sut.addSource("Gamma");

		expect(sut.links()).toHaveLength(1);
	});
});

function Adder({ entry }: { entry: SourceEntry }) {
	const append = useAppendSource();
	function addIt() {
		append(entry);
	}
	return (
		<button type="button" onClick={addIt}>
			Add
		</button>
	);
}

function Forcer() {
	const search = useSearch();
	function writeIt() {
		search.write("bun");
	}
	return (
		<>
			<button type="button" onClick={writeIt}>
				Write
			</button>
			<button type="button" onClick={search.run}>
				Run
			</button>
		</>
	);
}

class SUT {
	private names: string[] = [];
	private favicons = new Map<string, string>();
	private searchAnswer: () => Promise<Response> = async () => this.results();
	private listed = false;
	private sourceListAnswer: (() => Promise<Response>) | null = null;
	private extra = new SourceEntry(entry("Gamma", null));

	hasSources(names: string[]) {
		this.names = names;
	}

	hasFavicon(name: string, favicon: string) {
		this.favicons.set(name, favicon);
	}

	neverListSources() {
		this.sourceListAnswer = () => new Promise(() => {});
	}

	refuseSourceList() {
		this.sourceListAnswer = async () =>
			reply({ code: "INTERNAL_ERROR", message: "sources are down" }, "error");
	}

	neverAnswerSearches() {
		this.searchAnswer = () => new Promise(() => {});
	}

	refuseSearches(message: string) {
		this.searchAnswer = async () =>
			reply({ code: "INVALID_BODY", message }, "error");
	}

	show() {
		render(
			<ApiProvider
				session={openSession()}
				baseUrl="http://localhost"
				fetch={this.fetchIt}
			>
				<SourcesProvider>
					<SearchProvider>
						<SearchBox />
						<SearchResultList />
						<Adder entry={this.extra} />
					</SearchProvider>
				</SourcesProvider>
			</ApiProvider>,
		);
	}

	showSearchingWithoutBox() {
		render(
			<ApiProvider
				session={openSession()}
				baseUrl="http://localhost"
				fetch={this.fetchIt}
			>
				<SourcesProvider>
					<SearchProvider>
						<SearchResultList />
						<Forcer />
					</SearchProvider>
				</SourcesProvider>
			</ApiProvider>,
		);
	}

	async forceSearch() {
		await userEvent.click(screen.getByRole("button", { name: "Write" }));
		await userEvent.click(screen.getByRole("button", { name: "Run" }));
	}

	async sourcesListed() {
		await waitFor(() => expect(this.listed).toBe(true));
		await new Promise((resolve) => setTimeout(resolve, 20));
	}

	async search(query: string) {
		await userEvent.type(this.queryBox(), `${query}{Enter}`);
	}

	async addSource(name: string) {
		this.extra = new SourceEntry(entry(name, null));
		await userEvent.click(screen.getByRole("button", { name: "Add" }));
	}

	links() {
		return screen.queryAllByRole("link");
	}

	searchingNotice() {
		return screen.findByRole("status");
	}

	failureNotice() {
		return screen.findByRole("alert");
	}

	faviconOf(name: string) {
		return screen.getByAltText(`Favicon of ${name}`);
	}

	missingFavicon() {
		return screen.getByRole("img", { name: "No favicon" });
	}

	async linksOnceShown(count: number) {
		await waitFor(() => expect(this.links()).toHaveLength(count));
		return this.links();
	}

	private queryBox() {
		return screen.getByRole("textbox", { name: "Query" });
	}

	private results() {
		const results = this.names.map((name) => ({
			title: "Search it on Google",
			url: `https://www.google.com/search?q=bun site:${name}`,
			description: `Google search for «bun» limited to ${name}`,
			source: name,
		}));
		return reply({ results });
	}

	private fetchIt = async (request: Request) => {
		const path = new URL(request.url).pathname;
		let response: Promise<Response> = this.searchAnswer();
		if (path === "/sources.list") {
			this.listed = true;
			const sources = this.names.map((name) =>
				entry(name, this.favicons.get(name) ?? null),
			);
			response = Promise.resolve(reply({ sources }));
			if (this.sourceListAnswer !== null) {
				response = this.sourceListAnswer();
			}
		}
		return response;
	};
}

function entry(name: string, favicon: string | null) {
	return {
		sourceId: `s-${name}`,
		name,
		address: `https://${name}.com`,
		title: null,
		favicon,
	};
}

function reply(body: unknown, status = "ok") {
	const message = { header: { callId: "c", status }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
