import type { ReactNode } from "react";
import type { SourceEntry } from "@/domain/SourceEntry";

export interface SourceReading {
	view(): ReactNode;
	append(entry: SourceEntry): SourceReading;
	hasSources(): boolean;
	faviconOf(shownText: string): string | null;
}
