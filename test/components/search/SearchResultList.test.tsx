import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { SearchBox } from "@/components/search/SearchBox";
import { SearchProvider, useSearch } from "@/components/search/SearchProvider";
import { SearchResultList } from "@/components/search/SearchResultList";
import { SorzsProvider, useAppendSorz } from "@/components/sorzs/SorzsProvider";
import { SorzEntry } from "@/domain/SorzEntry";
import { openSession } from "../../support/openSession";

describe("SearchResultList", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows nothing before the first search", async () => {
		sut.show();
		await sut.sorzsListed();

		expect(sut.links()).toEqual([]);
	});

	test("shows each result with its title, description and sorz, in order", async () => {
		sut.hasSorzs(["Alpha", "Beta"]);
		sut.show();
		await sut.sorzsListed();

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
		sut.hasSorzs(["Alpha"]);
		sut.show();
		await sut.sorzsListed();

		await sut.search("bun");

		const [link] = await sut.linksOnceShown(1);
		expect(link).toHaveAttribute(
			"href",
			"https://www.google.com/search?q=bun site:Alpha",
		);
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	test("shows the favicon of the sorz of each result", async () => {
		sut.hasSorzs(["Alpha", "Beta"]);
		sut.hasFavicon("Alpha", "https://alpha.com/i.png");
		sut.show();
		await sut.sorzsListed();

		await sut.search("bun");

		await sut.linksOnceShown(2);
		expect(sut.faviconOf("Alpha")).toHaveAttribute(
			"src",
			"https://alpha.com/i.png",
		);
		expect(sut.missingFavicon()).toBeInTheDocument();
	});

	test("shows that it is searching until the answer arrives", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.neverAnswerSearches();
		sut.show();
		await sut.sorzsListed();

		await sut.search("bun");

		expect(await sut.searchingNotice()).toHaveTextContent("Searching");
	});

	test("shows why the search failed", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.refuseSearches("query is too long");
		sut.show();
		await sut.sorzsListed();

		await sut.search("bun");

		expect(await sut.failureNotice()).toHaveTextContent("query is too long");
	});

	test("shows a result without favicon while the sorzs are loading", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.neverListSorzs();
		sut.showSearchingWithoutBox();
		await sut.sorzsListed();

		await sut.forceSearch();

		await sut.linksOnceShown(1);
		expect(sut.missingFavicon()).toBeInTheDocument();
	});

	test("shows a result without favicon when the sorzs failed to load", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.refuseSorzList();
		sut.showSearchingWithoutBox();
		await sut.sorzsListed();

		await sut.forceSearch();

		await sut.linksOnceShown(1);
		expect(sut.missingFavicon()).toBeInTheDocument();
	});

	test("keeps the results when a sorz is added afterwards", async () => {
		sut.hasSorzs(["Alpha"]);
		sut.show();
		await sut.sorzsListed();
		await sut.search("bun");
		await sut.linksOnceShown(1);

		await sut.addSorz("Gamma");

		expect(sut.links()).toHaveLength(1);
	});
});

function Adder({ entry }: { entry: SorzEntry }) {
	const append = useAppendSorz();
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
	private sorzListAnswer: (() => Promise<Response>) | null = null;
	private extra = new SorzEntry(entry("Gamma", null));

	hasSorzs(names: string[]) {
		this.names = names;
	}

	hasFavicon(name: string, favicon: string) {
		this.favicons.set(name, favicon);
	}

	neverListSorzs() {
		this.sorzListAnswer = () => new Promise(() => {});
	}

	refuseSorzList() {
		this.sorzListAnswer = async () =>
			reply({ code: "INTERNAL_ERROR", message: "sorzs are down" }, "error");
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
				<SorzsProvider>
					<SearchProvider>
						<SearchBox />
						<SearchResultList />
						<Adder entry={this.extra} />
					</SearchProvider>
				</SorzsProvider>
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
				<SorzsProvider>
					<SearchProvider>
						<SearchResultList />
						<Forcer />
					</SearchProvider>
				</SorzsProvider>
			</ApiProvider>,
		);
	}

	async forceSearch() {
		await userEvent.click(screen.getByRole("button", { name: "Write" }));
		await userEvent.click(screen.getByRole("button", { name: "Run" }));
	}

	async sorzsListed() {
		await waitFor(() => expect(this.listed).toBe(true));
		await new Promise((resolve) => setTimeout(resolve, 20));
	}

	async search(query: string) {
		await userEvent.type(this.queryBox(), `${query}{Enter}`);
	}

	async addSorz(name: string) {
		this.extra = new SorzEntry(entry(name, null));
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
			sorz: name,
		}));
		return reply({ results });
	}

	private fetchIt = async (request: Request) => {
		const path = new URL(request.url).pathname;
		let response: Promise<Response> = this.searchAnswer();
		if (path === "/sorzs.list") {
			this.listed = true;
			const sorzs = this.names.map((name) =>
				entry(name, this.favicons.get(name) ?? null),
			);
			response = Promise.resolve(reply({ sorzs }));
			if (this.sorzListAnswer !== null) {
				response = this.sorzListAnswer();
			}
		}
		return response;
	};
}

function entry(name: string, favicon: string | null) {
	return {
		sorzId: `s-${name}`,
		name,
		address: `https://${name}.com`,
		title: null,
		favicon,
		provider: "generic",
	};
}

function reply(body: unknown, status = "ok") {
	const message = { header: { callId: "c", status }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
