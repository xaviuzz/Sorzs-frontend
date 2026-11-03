import { Library } from "lucide-react";
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
			<div
				className={`flex flex-col items-center gap-3 px-2 py-6 text-center ${HIDDEN_WHEN_COLLAPSED}`}
			>
				<Library
					className="size-8 text-muted-foreground"
					strokeWidth={1.5}
					aria-hidden="true"
				/>
				<p className="text-sm text-muted-foreground">You have no sources yet</p>
			</div>
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
