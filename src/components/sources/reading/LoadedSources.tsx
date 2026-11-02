import type { ReactNode } from "react";
import { SourceMenuItem } from "@/components/sources/list/SourceMenuItem";
import { HIDDEN_WHEN_COLLAPSED } from "@/components/sources/reading/hiddenWhenCollapsed";
import type { SourceReading } from "@/components/sources/reading/SourceReading";
import { SidebarMenu } from "@/components/ui/sidebar";
import type { SourceEntry } from "@/domain/SourceEntry";

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
