import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import {
	SourcesProvider,
	useAppendSource,
	useSourceReading,
} from "@/components/sources/SourcesProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SourceEntry, type SourceEntryData } from "@/domain/SourceEntry";

describe("SourcesProvider", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("appends an added source after the ones already listed", async () => {
		sut.answerEntries([entry("s-1", "Alpha")]);
		sut.willAdd(entry("s-2", "Beta"));
		sut.show();
		await sut.namesOnceListed(1);

		await sut.add();

		expect(await sut.namesOnceListed(2)).toEqual(["Alpha", "Beta"]);
	});

	test("replaces the empty notice when the first source is added", async () => {
		sut.answerEntries([]);
		sut.willAdd(entry("s-1", "Alpha"));
		sut.show();
		await sut.emptyNoticeOnceListed();

		await sut.add();

		expect(await sut.namesOnceListed(1)).toEqual(["Alpha"]);
		expect(sut.emptyNotice()).not.toBeInTheDocument();
	});

	test("needs its provider to read the sources", () => {
		expect(() => sut.showReaderWithoutProvider()).toThrow("SourcesProvider");
	});

	test("needs its provider to append a source", () => {
		expect(() => sut.showAppenderWithoutProvider()).toThrow("SourcesProvider");
	});
});

type Entry = SourceEntryData;

function entry(sourceId: string, name: string): Entry {
	return {
		sourceId,
		name,
		address: `https://${name}.com`,
		title: null,
		favicon: null,
	};
}

function Reader() {
	const reading = useSourceReading();
	return <SidebarProvider>{reading.view()}</SidebarProvider>;
}

function Appender({ added }: { added: Entry }) {
	const append = useAppendSource();
	function addIt() {
		append(new SourceEntry(added));
	}
	return (
		<button type="button" onClick={addIt}>
			Append
		</button>
	);
}

class SUT {
	private answer: () => Promise<Response> = () => new Promise(() => {});
	private added: Entry = entry("s-0", "Zero");

	answerEntries(entries: Entry[]) {
		this.answer = async () => reply({ sources: entries });
	}

	show() {
		render(
			<ApiProvider baseUrl="http://localhost" fetch={() => this.answer()}>
				<SourcesProvider>
					<Reader />
					<Appender added={this.added} />
				</SourcesProvider>
			</ApiProvider>,
		);
	}

	showReaderWithoutProvider() {
		this.withoutConsoleErrors(() => render(<Reader />));
	}

	showAppenderWithoutProvider() {
		this.withoutConsoleErrors(() => render(<Appender added={this.added} />));
	}

	willAdd(added: Entry) {
		this.added = added;
	}

	async add() {
		await userEvent.click(screen.getByRole("button", { name: "Append" }));
	}

	async namesOnceListed(count: number) {
		await waitFor(() =>
			expect(screen.getAllByRole("listitem")).toHaveLength(count),
		);
		return screen
			.getAllByRole("listitem")
			.map((item) => item.querySelector("[title]")?.textContent);
	}

	emptyNoticeOnceListed() {
		return screen.findByText("You have no sources yet");
	}

	emptyNotice() {
		return screen.queryByText("You have no sources yet");
	}

	private withoutConsoleErrors(action: () => void) {
		const silenced = console.error;
		console.error = () => {};
		try {
			action();
		} finally {
			console.error = silenced;
		}
	}
}

function reply(body: unknown) {
	const message = { header: { callId: "c", status: "ok" }, body };
	return new Response(JSON.stringify(message), {
		headers: { "content-type": "application/json" },
	});
}
