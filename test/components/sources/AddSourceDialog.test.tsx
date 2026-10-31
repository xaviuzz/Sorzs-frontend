import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
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

	answerInspected(info: { title: string | null; favicon: string | null }) {
		this.inspectAnswer = async () => reply("ok", info);
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

	dialog() {
		return screen.queryByRole("dialog");
	}

	addressField() {
		return screen.getByRole("textbox", { name: "Address" });
	}

	nameField() {
		return screen.getByRole("textbox", { name: "Name" });
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

function reply(status: string, body: unknown) {
	const message = { header: { callId: "c", status }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
