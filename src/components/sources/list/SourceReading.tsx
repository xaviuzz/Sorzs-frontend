import type { ReactNode } from "react";
import { SourceMenuItem } from "@/components/sources/list/SourceMenuItem";
import { messageOf } from "@/components/sources/messageOf";
import { SidebarMenu } from "@/components/ui/sidebar";
import type { SourceEntry } from "@/domain/SourceEntry";

const HIDDEN_WHEN_COLLAPSED = "group-data-[collapsible=icon]:hidden";

export interface SourceReading {
	view(): ReactNode;
	append(entry: SourceEntry): SourceReading;
	hasSources(): boolean;
	faviconOf(shownText: string): string | null;
}

export class LoadingSources implements SourceReading {
	append(): SourceReading {
		return this;
	}

	hasSources(): boolean {
		return false;
	}

	faviconOf(): string | null {
		return null;
	}

	view(): ReactNode {
		return (
			<p role="status" className={HIDDEN_WHEN_COLLAPSED}>
				Loading sources
			</p>
		);
	}
}

export class LoadedSources implements SourceReading {
	constructor(private readonly entries: SourceEntry[]) {}

	append(entry: SourceEntry): SourceReading {
		return new LoadedSources([...this.entries, entry]);
	}

	hasSources(): boolean {
		return this.entries.length > 0;
	}

	faviconOf(shownText: string): string | null {
		const entry = this.entries.find((each) => each.shownText() === shownText);
		let favicon: string | null = null;
		if (entry !== undefined) {
			favicon = entry.favicon;
		}
		return favicon;
	}

	view(): ReactNode {
		let view: ReactNode = (
			<p className={`text-muted-foreground ${HIDDEN_WHEN_COLLAPSED}`}>
				You have no sources yet
			</p>
		);
		if (this.entries.length > 0) {
			view = (
				<SidebarMenu>
					{this.entries.map((entry) => (
						<SourceMenuItem key={entry.sourceId} entry={entry} />
					))}
				</SidebarMenu>
			);
		}
		return view;
	}
}

export class FailedSources implements SourceReading {
	constructor(private readonly message: string) {}

	static from(error: unknown): FailedSources {
		const message = messageOf(error, "Sources could not be loaded");
		return new FailedSources(message);
	}

	append(): SourceReading {
		return this;
	}

	hasSources(): boolean {
		return false;
	}

	faviconOf(): string | null {
		return null;
	}

	view(): ReactNode {
		return (
			<p role="alert" className={`text-error ${HIDDEN_WHEN_COLLAPSED}`}>
				{this.message}
			</p>
		);
	}
}
