import type { ReactNode } from "react";
import type { SorzEntry } from "@/domain/SorzEntry";

export interface SorzReading {
	view(): ReactNode;
	append(entry: SorzEntry): SorzReading;
	hasSorzs(): boolean;
	faviconOf(shownText: string): string | null;
}
