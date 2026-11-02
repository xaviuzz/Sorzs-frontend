import type { ReactNode } from "react";
import { messageOf } from "@/components/sources/messageOf";
import { HIDDEN_WHEN_COLLAPSED } from "@/components/sources/reading/hiddenWhenCollapsed";
import type { SourceReading } from "@/components/sources/reading/SourceReading";

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
