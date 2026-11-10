import type { ReactNode } from "react";
import { HIDDEN_WHEN_COLLAPSED } from "@/components/sorzs/reading/hiddenWhenCollapsed";
import type { SorzReading } from "@/components/sorzs/reading/SorzReading";

export class LoadingSorzs implements SorzReading {
	append(): SorzReading {
		return this;
	}

	hasSorzs(): boolean {
		return false;
	}

	faviconOf(): string | null {
		return null;
	}

	view(): ReactNode {
		return (
			<p role="status" className={HIDDEN_WHEN_COLLAPSED}>
				Loading sorzs
			</p>
		);
	}
}
