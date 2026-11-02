import type { ReactNode } from "react";
import { HIDDEN_WHEN_COLLAPSED } from "@/components/sources/reading/hiddenWhenCollapsed";
import type { SourceReading } from "@/components/sources/reading/SourceReading";

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
