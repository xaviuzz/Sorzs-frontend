import { Library } from "lucide-react";
import type { ReactNode } from "react";
import { SorzMenuItem } from "@/components/sorzs/list/SorzMenuItem";
import { HIDDEN_WHEN_COLLAPSED } from "@/components/sorzs/reading/hiddenWhenCollapsed";
import type { SorzReading } from "@/components/sorzs/reading/SorzReading";
import { SidebarMenu } from "@/components/ui/sidebar";
import type { SorzEntry } from "@/domain/SorzEntry";

export class LoadedSorzs implements SorzReading {
	constructor(private readonly entries: SorzEntry[]) {}

	append(entry: SorzEntry): SorzReading {
		return new LoadedSorzs([...this.entries, entry]);
	}

	hasSorzs(): boolean {
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
				<p className="text-sm text-muted-foreground">You have no sorzs yet</p>
			</div>
		);
		if (this.entries.length > 0) {
			view = (
				<SidebarMenu>
					{this.entries.map((entry) => (
						<SorzMenuItem key={entry.sorzId} entry={entry} />
					))}
				</SidebarMenu>
			);
		}
		return view;
	}
}
