import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiProvider } from "@/api/ApiContext";
import {
	SorzsProvider,
	useAppendSorz,
	useSorzReading,
} from "@/components/sorzs/SorzsProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SorzEntry, type SorzEntryData } from "@/domain/SorzEntry";
import { openSession } from "../../support/openSession";

describe("SorzsProvider", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("appends an added sorz after the ones already listed", async () => {
		sut.answerEntries([entry("s-1", "Alpha")]);
		sut.willAdd(entry("s-2", "Beta"));
		sut.show();
		await sut.namesOnceListed(1);

		await sut.add();

		expect(await sut.namesOnceListed(2)).toEqual(["Alpha", "Beta"]);
	});

	test("replaces the empty notice when the first sorz is added", async () => {
		sut.answerEntries([]);
		sut.willAdd(entry("s-1", "Alpha"));
		sut.show();
		await sut.emptyNoticeOnceListed();

		await sut.add();

		expect(await sut.namesOnceListed(1)).toEqual(["Alpha"]);
		expect(sut.emptyNotice()).not.toBeInTheDocument();
	});

	test("ignores an added sorz while the sorzs are loading", async () => {
		sut.willAdd(entry("s-1", "Alpha"));
		sut.show();
		await sut.loadingNotice();

		await sut.add();

		expect(sut.loadingNoticeNow()).toBeInTheDocument();
		expect(sut.names()).toEqual([]);
	});

	test("ignores an added sorz when the sorzs failed to load", async () => {
		sut.refuseEntries("sorzs are down");
		sut.willAdd(entry("s-1", "Alpha"));
		sut.show();
		await sut.failureNotice();

		await sut.add();

		expect(sut.failureNoticeNow()).toHaveTextContent("sorzs are down");
		expect(sut.names()).toEqual([]);
	});

	test("needs its provider to read the sorzs", () => {
		expect(() => sut.showReaderWithoutProvider()).toThrow("SorzsProvider");
	});

	test("needs its provider to append a sorz", () => {
		expect(() => sut.showAppenderWithoutProvider()).toThrow("SorzsProvider");
	});
});

type Entry = SorzEntryData;

function entry(sorzId: string, name: string): Entry {
	return {
		sorzId,
		name,
		address: `https://${name}.com`,
		title: null,
		favicon: null,
		provider: "generic",
	};
}

function Reader() {
	const reading = useSorzReading();
	return <SidebarProvider>{reading.view()}</SidebarProvider>;
}

function Appender({ added }: { added: Entry }) {
	const append = useAppendSorz();
	function addIt() {
		append(new SorzEntry(added));
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
		this.answer = async () => reply({ sorzs: entries });
	}

	refuseEntries(message: string) {
		this.answer = async () => refusal(message);
	}

	show() {
		render(
			<ApiProvider
				session={openSession()}
				baseUrl="http://localhost"
				fetch={() => this.answer()}
			>
				<SorzsProvider>
					<Reader />
					<Appender added={this.added} />
				</SorzsProvider>
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

	loadingNotice() {
		return screen.findByRole("status");
	}

	loadingNoticeNow() {
		return screen.getByRole("status");
	}

	failureNotice() {
		return screen.findByRole("alert");
	}

	failureNoticeNow() {
		return screen.getByRole("alert");
	}

	names() {
		return screen.queryAllByRole("listitem");
	}

	emptyNoticeOnceListed() {
		return screen.findByText("You have no sorzs yet");
	}

	emptyNotice() {
		return screen.queryByText("You have no sorzs yet");
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

function refusal(message: string) {
	const reply = {
		header: { callId: "c", status: "error" },
		body: { code: "INTERNAL_ERROR", message },
	};
	return new Response(JSON.stringify(reply), {
		headers: { "content-type": "application/json" },
	});
}
