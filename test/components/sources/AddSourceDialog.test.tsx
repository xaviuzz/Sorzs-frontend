import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import { AddSourceDialog } from "@/components/sources/AddSourceDialog";
import { SourceEntry, type SourceEntryData } from "@/domain/SourceEntry";

describe("AddSourceDialog", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("opens from the Add Sorz button with an address and a name", async () => {
		sut.show();

		await sut.open();

		expect(sut.addressField()).toBeInTheDocument();
		expect(sut.nameField()).toBeInTheDocument();
	});

	test("titles itself Add Sorz with the name in the brand font", async () => {
		sut.show();

		await sut.open();

		expect(sut.dialog()).toHaveAccessibleName("Add Sorz");
		expect(sut.dialog()).toHaveAccessibleDescription(
			"Register the URL of a site you trust and give it a title.",
		);
		expect(sut.description()).toHaveClass("sr-only");
		expect(sut.brandName()).toHaveClass("font-script");
	});

	test("posts what was typed", async () => {
		sut.show();
		await sut.open();

		await sut.fillAndSubmit("https://example.com", "Example");

		expect(await sut.bodyPostedOnceSent()).toEqual({
			address: "https://example.com",
			name: "Example",
		});
	});

	test("hands the created entry to its owner and closes", async () => {
		sut.answerCreated({
			sourceId: "s-1",
			name: "Example",
			address: "https://example.com",
			title: null,
			favicon: null,
		});
		sut.show();
		await sut.open();

		await sut.fillAndSubmit("https://example.com", "Example");

		expect(await sut.entryOnceAdded()).toEqual(
			new SourceEntry({
				sourceId: "s-1",
				name: "Example",
				address: "https://example.com",
				title: null,
				favicon: null,
			}),
		);
		expect(sut.dialog()).not.toBeInTheDocument();
	});

	test("opens empty again after an addition", async () => {
		sut.answerCreated({
			sourceId: "s-1",
			name: "Example",
			address: "https://example.com",
			title: null,
			favicon: null,
		});
		sut.show();
		await sut.open();
		await sut.fillAndSubmit("https://example.com", "Example");
		await sut.entryOnceAdded();

		await sut.open();

		expect(sut.addressField()).toHaveValue("");
		expect(sut.nameField()).toHaveValue("");
	});

	test("suggests the page title as the name when leaving the address", async () => {
		sut.answerInspected({ title: "Example Domain", favicon: null });
		sut.show();
		await sut.open();

		await sut.writeAddress("https://example.com");

		await waitFor(() => expect(sut.nameField()).toHaveValue("Example Domain"));
		expect(sut.addressesInspected()).toEqual(["https://example.com"]);
	});

	test("suggests a long page title shortened to fit the name", async () => {
		sut.answerInspected({
			title:
				"elDiario.es - Noticias de actualidad - Periodismo a pesar de todo",
			favicon: null,
		});
		sut.show();
		await sut.open();

		await sut.writeAddress("https://www.eldiario.es/");

		await waitFor(() =>
			expect(sut.nameField()).toHaveValue(
				"elDiario.es - Noticias de actualidad",
			),
		);
	});

	test("keeps a name the user wrote", async () => {
		sut.answerInspected({ title: "Example Domain", favicon: null });
		sut.show();
		await sut.open();
		await userEvent.type(sut.nameField(), "Mine");

		await sut.writeAddress("https://example.com");

		await waitFor(() => expect(sut.addressesInspected()).toHaveLength(1));
		expect(sut.nameField()).toHaveValue("Mine");
	});

	test("replaces an earlier suggestion with the title of a new address", async () => {
		sut.answerInspected({ title: "Example Domain", favicon: null });
		sut.show();
		await sut.open();
		await sut.writeAddress("https://example.com");
		await waitFor(() => expect(sut.nameField()).toHaveValue("Example Domain"));

		sut.answerInspected({ title: "Other Site", favicon: null });
		await sut.writeAddress("https://other.com");

		await waitFor(() => expect(sut.nameField()).toHaveValue("Other Site"));
	});

	test("keeps a suggestion the user edited", async () => {
		sut.answerInspected({ title: "Example Domain", favicon: null });
		sut.show();
		await sut.open();
		await sut.writeAddress("https://example.com");
		await waitFor(() => expect(sut.nameField()).toHaveValue("Example Domain"));
		await userEvent.type(sut.nameField(), "!");

		sut.answerInspected({ title: "Other Site", favicon: null });
		await sut.writeAddress("https://other.com");

		await waitFor(() => expect(sut.addressesInspected()).toHaveLength(2));
		expect(sut.nameField()).toHaveValue("Example Domain!");
	});

	test("suggests nothing when the page offers no title", async () => {
		sut.answerInspected({ title: null, favicon: null });
		sut.show();
		await sut.open();

		await sut.writeAddress("https://example.com");

		await waitFor(() => expect(sut.addressesInspected()).toHaveLength(1));
		expect(sut.nameField()).toHaveValue("");
	});

	test("shows the page favicon once the address is inspected", async () => {
		sut.answerInspected({
			title: "Example Domain",
			favicon: "https://example.com/icon.png",
		});
		sut.show();
		await sut.open();
		expect(sut.favicon()).not.toBeInTheDocument();

		await sut.writeAddress("https://example.com");

		expect(await sut.faviconOnceInspected()).toHaveAttribute(
			"src",
			"https://example.com/icon.png",
		);
	});

	test("shows the neutral icon when the page offers no favicon", async () => {
		sut.answerInspected({ title: "Example Domain", favicon: null });
		sut.show();
		await sut.open();

		await sut.writeAddress("https://example.com");

		expect(await sut.neutralIconOnceInspected()).toBeInTheDocument();
	});

	test("hides the favicon while a new address is typed", async () => {
		sut.answerInspected({
			title: null,
			favicon: "https://example.com/icon.png",
		});
		sut.show();
		await sut.open();
		await sut.writeAddress("https://example.com");
		await sut.faviconOnceInspected();

		await userEvent.type(sut.addressField(), "/more");

		expect(sut.favicon()).not.toBeInTheDocument();
	});

	test("shows no icon when the page cannot be read", async () => {
		sut.failInspection();
		sut.show();
		await sut.open();

		await sut.writeAddress("https://example.com");

		await waitFor(() => expect(sut.addressesInspected()).toHaveLength(1));
		expect(sut.favicon()).not.toBeInTheDocument();
		expect(sut.neutralIcon()).not.toBeInTheDocument();
	});

	test("an inspect refusal is silent", async () => {
		sut.refuseInspection("INVALID_BODY", "address must be complete");
		sut.show();
		await sut.open();

		await sut.writeAddress("not an address");

		await waitFor(() => expect(sut.addressesInspected()).toHaveLength(1));
		expect(sut.error()).not.toBeInTheDocument();
		expect(sut.nameField()).toHaveValue("");
	});

	test("an inspect network failure is silent", async () => {
		sut.failInspection();
		sut.show();
		await sut.open();

		await sut.writeAddress("https://example.com");

		await waitFor(() => expect(sut.addressesInspected()).toHaveLength(1));
		expect(sut.error()).not.toBeInTheDocument();
		expect(sut.nameField()).toHaveValue("");
	});

	test("does not inspect an empty address", async () => {
		sut.show();
		await sut.open();

		await userEvent.click(sut.addressField());
		await userEvent.tab();

		expect(sut.addressesInspected()).toEqual([]);
	});

	test("offers no candidates when the page has only itself", async () => {
		sut.answerInspected({
			title: "A",
			favicon: null,
			candidates: [{ address: "https://a.com", title: "A", favicon: null }],
		});
		sut.show();
		await sut.open();

		await sut.writeAddress("https://a.com");

		await waitFor(() => expect(sut.nameField()).toHaveValue("A"));
		expect(sut.candidate("A")).not.toBeInTheDocument();
	});

	test("offers every candidate by title with two or more", async () => {
		sut.answerInspected(deepSite());
		sut.show();
		await sut.open();

		await sut.writeAddress("https://a.com/docs/guide");

		expect(await sut.candidateOnceInspected("Home")).toBeInTheDocument();
		expect(sut.candidate("Docs")).toBeInTheDocument();
		expect(sut.candidate("Guide")).toBeInTheDocument();
	});

	test("shows a long candidate title shortened as a name would be", async () => {
		sut.answerInspected({
			title: "Home",
			favicon: null,
			candidates: [
				{ address: "https://a.com", title: "Home", favicon: null },
				{
					address: "https://a.com/long",
					title:
						"elDiario.es - Noticias de actualidad - Periodismo a pesar de todo",
					favicon: null,
				},
			],
		});
		sut.show();
		await sut.open();

		await sut.writeAddress("https://a.com/long");

		expect(
			await sut.candidateOnceInspected("elDiario.es - Noticias de actualidad"),
		).toBeInTheDocument();
	});

	test("shows the address of a candidate on hover", async () => {
		sut.answerInspected(deepSite());
		sut.show();
		await sut.open();

		await sut.writeAddress("https://a.com/docs/guide");

		expect(await sut.candidateOnceInspected("Docs")).toHaveAttribute(
			"title",
			"https://a.com/docs",
		);
	});

	test("shows every candidate even when titles repeat", async () => {
		sut.answerInspected({
			title: "Same",
			favicon: null,
			candidates: [
				{ address: "https://a.com", title: "Same", favicon: null },
				{ address: "https://a.com/docs", title: "Same", favicon: null },
			],
		});
		sut.show();
		await sut.open();

		await sut.writeAddress("https://a.com/docs");

		expect(await sut.candidatesOnceInspected("Same")).toHaveLength(2);
	});

	test("marks the pasted address as the chosen candidate", async () => {
		sut.answerInspected(deepSite());
		sut.show();
		await sut.open();

		await sut.writeAddress("https://a.com/docs/guide");

		expect(await sut.candidateOnceInspected("Guide")).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(sut.candidate("Home")).toHaveAttribute("aria-pressed", "false");
	});

	test("choosing a candidate overwrites the address and the name", async () => {
		sut.answerInspected(deepSite());
		sut.show();
		await sut.open();
		await sut.writeAddress("https://a.com/docs/guide");
		await userEvent.type(sut.nameField(), "!");

		await sut.choose("Home");

		expect(sut.addressField()).toHaveValue("https://a.com");
		expect(sut.nameField()).toHaveValue("Home");
	});

	test("choosing a candidate marks it and keeps the list", async () => {
		sut.answerInspected(deepSite());
		sut.show();
		await sut.open();
		await sut.writeAddress("https://a.com/docs/guide");

		await sut.choose("Home");

		expect(sut.candidate("Home")).toHaveAttribute("aria-pressed", "true");
		expect(sut.candidate("Guide")).toHaveAttribute("aria-pressed", "false");
	});

	test("choosing a candidate moves the favicon beside the name", async () => {
		sut.answerInspected(deepSite());
		sut.show();
		await sut.open();
		await sut.writeAddress("https://a.com/docs/guide");

		await sut.choose("Home");

		expect(sut.favicon()).toHaveAttribute("src", "https://a.com/home.png");
	});

	test("the chosen candidate is marked no more once the name is edited", async () => {
		sut.answerInspected(deepSite());
		sut.show();
		await sut.open();
		await sut.writeAddress("https://a.com/docs/guide");
		await sut.choose("Home");

		await userEvent.type(sut.nameField(), "!");

		expect(sut.candidate("Home")).toHaveAttribute("aria-pressed", "false");
	});

	test("hides the candidates while a new address is typed", async () => {
		sut.answerInspected(deepSite());
		sut.show();
		await sut.open();
		await sut.writeAddress("https://a.com/docs/guide");
		await sut.candidateOnceInspected("Home");

		await userEvent.type(sut.addressField(), "/more");

		expect(sut.candidate("Home")).not.toBeInTheDocument();
	});

	test("drops a reply for an address the user has since changed", async () => {
		sut.show();
		await sut.open();
		const release = sut.holdInspection(deepSite());
		await sut.writeAddress("https://a.com/docs/guide");
		await userEvent.type(sut.addressField(), "/more");

		await release();

		expect(sut.candidate("Home")).not.toBeInTheDocument();
		expect(sut.nameField()).toHaveValue("");
		expect(sut.favicon()).not.toBeInTheDocument();
	});

	test("posts an empty name when none was given", async () => {
		sut.show();
		await sut.open();

		await sut.fillAndSubmit("https://example.com", "");

		expect(await sut.bodyPostedOnceSent()).toEqual({
			address: "https://example.com",
			name: "",
		});
	});

	test.each([
		["SOURCE_ALREADY_REGISTERED", "that address is already in your list"],
		["SOURCE_NAME_TAKEN", "that name is already in your list"],
		["INVALID_BODY", "address must be a complete http or https address"],
	])(
		"a %s refusal shows its message and keeps the dialog as it was",
		async (code, message) => {
			sut.answerRefusal(code, message);
			sut.show();
			await sut.open();

			await sut.fillAndSubmit("https://example.com", "Example");

			expect(await sut.errorOnceFailed()).toHaveTextContent(message);
			expect(sut.dialog()).toBeInTheDocument();
			expect(sut.addressField()).toHaveValue("https://example.com");
			expect(sut.nameField()).toHaveValue("Example");
			expect(sut.entries()).toEqual([]);
		},
	);

	test("a network failure shows its message and keeps the dialog as it was", async () => {
		sut.failNetwork();
		sut.show();
		await sut.open();

		await sut.fillAndSubmit("https://example.com", "Example");

		expect(await sut.errorOnceFailed()).toHaveTextContent("network down");
		expect(sut.dialog()).toBeInTheDocument();
		expect(sut.addressField()).toHaveValue("https://example.com");
		expect(sut.nameField()).toHaveValue("Example");
	});

	test("the submit button is disabled while sending", async () => {
		sut.show();
		await sut.open();

		await sut.fillAndSubmit("https://example.com", "Example");

		expect(sut.submitButton()).toBeDisabled();
	});

	test("the submit button is enabled again after a refusal", async () => {
		sut.answerRefusal("SOURCE_NAME_TAKEN", "that name is already in your list");
		sut.show();
		await sut.open();
		await sut.fillAndSubmit("https://example.com", "Example");
		await sut.errorOnceFailed();

		expect(sut.submitButton()).toBeEnabled();
	});

	test("clears the previous message when it is submitted again", async () => {
		sut.answerRefusal("SOURCE_NAME_TAKEN", "that name is already in your list");
		sut.show();
		await sut.open();
		await sut.fillAndSubmit("https://example.com", "Example");
		await sut.errorOnceFailed();

		sut.neverAnswer();
		await sut.submit();

		expect(sut.error()).not.toBeInTheDocument();
	});
});

class SUT {
	private answer: () => Promise<Response> = () => new Promise(() => {});
	private added: SourceEntry[] = [];
	private posted: unknown;
	private inspectAnswer: () => Promise<Response> = () => new Promise(() => {});
	private inspected: string[] = [];

	answerCreated(entry: SourceEntryData) {
		this.answer = async () => reply("ok", entry);
	}

	answerRefusal(code: string, message: string) {
		this.answer = async () => reply("error", { code, message });
	}

	failNetwork() {
		this.answer = async () => {
			throw new TypeError("network down");
		};
	}

	answerInspected(info: InspectedInfo) {
		this.inspectAnswer = async () => reply("ok", { candidates: [], ...info });
	}

	holdInspection(info: InspectedInfo) {
		let release = () => {};
		const held = new Promise<void>((resolve) => {
			release = resolve;
		});
		this.inspectAnswer = async () => {
			await held;
			return reply("ok", { candidates: [], ...info });
		};
		return async () => {
			release();
			await waitFor(() => expect(this.inspected.length).toBeGreaterThan(0));
			await new Promise((resolve) => setTimeout(resolve, 20));
		};
	}

	refuseInspection(code: string, message: string) {
		this.inspectAnswer = async () => reply("error", { code, message });
	}

	failInspection() {
		this.inspectAnswer = async () => {
			throw new TypeError("network down");
		};
	}

	neverAnswer() {
		this.answer = () => new Promise(() => {});
	}

	show() {
		const fetch = async (request: Request) => {
			const call = await request.json();
			if (request.url.endsWith("/sources.inspect")) {
				this.inspected.push(call.body.address);
				return this.inspectAnswer();
			}
			this.posted = call.body;
			return this.answer();
		};
		render(
			<ApiProvider baseUrl="http://localhost" fetch={fetch}>
				<AddSourceDialog onAdded={(entry) => this.added.push(entry)} />
			</ApiProvider>,
		);
	}

	async open() {
		await userEvent.click(screen.getByRole("button", { name: "Add Sorz" }));
	}

	async writeAddress(address: string) {
		await userEvent.clear(this.addressField());
		await userEvent.type(this.addressField(), address);
		await userEvent.tab();
	}

	addressesInspected() {
		return this.inspected;
	}

	async fillAndSubmit(address: string, name: string) {
		await userEvent.clear(this.addressField());
		await userEvent.type(this.addressField(), address);
		await userEvent.clear(this.nameField());
		if (name !== "") {
			await userEvent.type(this.nameField(), name);
		}
		await this.submit();
	}

	async submit() {
		await userEvent.click(this.submitButton());
	}

	description() {
		return screen.getByText(
			"Register the URL of a site you trust and give it a title.",
		);
	}

	brandName() {
		return within(screen.getByRole("dialog")).getByText("Sorz");
	}

	dialog() {
		return screen.queryByRole("dialog");
	}

	addressField() {
		return screen.getByRole("textbox", { name: "URL" });
	}

	nameField() {
		return screen.getByRole("textbox", { name: "Title" });
	}

	candidate(title: string) {
		return screen.queryByRole("button", { name: title });
	}

	candidateOnceInspected(title: string) {
		return screen.findByRole("button", { name: title });
	}

	candidatesOnceInspected(title: string) {
		return screen.findAllByRole("button", { name: title });
	}

	async choose(title: string) {
		await userEvent.click(screen.getByRole("button", { name: title }));
	}

	favicon() {
		return screen.queryByRole("img", { name: /^Favicon of / });
	}

	faviconOnceInspected() {
		return screen.findByRole("img", { name: /^Favicon of / });
	}

	neutralIcon() {
		return screen.queryByRole("img", { name: "No favicon" });
	}

	neutralIconOnceInspected() {
		return screen.findByRole("img", { name: "No favicon" });
	}

	submitButton() {
		return screen.getByRole("button", { name: "Add" });
	}

	error() {
		return screen.queryByRole("alert");
	}

	errorOnceFailed() {
		return screen.findByRole("alert");
	}

	async bodyPostedOnceSent() {
		await waitFor(() => expect(this.posted).toBeDefined());
		return this.posted;
	}

	async entryOnceAdded() {
		await waitFor(() => expect(this.added).toHaveLength(1));
		return this.added[0];
	}

	entries() {
		return this.added;
	}
}

type InspectedInfo = {
	title: string | null;
	favicon: string | null;
	candidates?: { address: string; title: string; favicon: string | null }[];
};

function deepSite(): InspectedInfo {
	return {
		title: "Guide",
		favicon: "https://a.com/guide.png",
		candidates: [
			{
				address: "https://a.com",
				title: "Home",
				favicon: "https://a.com/home.png",
			},
			{ address: "https://a.com/docs", title: "Docs", favicon: null },
			{
				address: "https://a.com/docs/guide",
				title: "Guide",
				favicon: "https://a.com/guide.png",
			},
		],
	};
}

function reply(status: string, body: unknown) {
	const message = { header: { callId: "c", status }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
