import type { ReactNode } from "react";
import { messageOf } from "@/components/sources/messageOf";
import { SourceMenuItem } from "@/components/sources/SourceMenuItem";
import { SidebarMenu } from "@/components/ui/sidebar";
import type { SourceEntry } from "@/domain/SourceEntry";

const HIDDEN_WHEN_COLLAPSED = "group-data-[collapsible=icon]:hidden";

export interface SourceReading {
	view(): ReactNode;
	append(entry: SourceEntry): SourceReading;
}

export class LoadingSources implements SourceReading {
	append(): SourceReading {
		return this;
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

	view(): ReactNode {
		return (
			<p role="alert" className={`text-error ${HIDDEN_WHEN_COLLAPSED}`}>
				{this.message}
			</p>
		);
	}
}
