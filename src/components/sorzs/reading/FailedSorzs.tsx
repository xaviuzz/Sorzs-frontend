import type { ReactNode } from "react";
import { messageOf } from "@/components/messageOf";
import { HIDDEN_WHEN_COLLAPSED } from "@/components/sorzs/reading/hiddenWhenCollapsed";
import type { SorzReading } from "@/components/sorzs/reading/SorzReading";

export class FailedSorzs implements SorzReading {
	constructor(private readonly message: string) {}

	static from(error: unknown): FailedSorzs {
		const message = messageOf(error, "Sorzs could not be loaded");
		return new FailedSorzs(message);
	}

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
			<p role="alert" className={`text-error ${HIDDEN_WHEN_COLLAPSED}`}>
				{this.message}
			</p>
		);
	}
}
