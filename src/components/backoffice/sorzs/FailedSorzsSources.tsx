import type { ReactNode } from "react";
import type { SorzsSourcesReading } from "@/components/backoffice/sorzs/SorzsSourcesReading";
import { messageOf } from "@/components/messageOf";

export class FailedSorzsSources implements SorzsSourcesReading {
	constructor(private readonly message: string) {}

	static from(error: unknown): FailedSorzsSources {
		const message = messageOf(error, "Sources could not be loaded");
		return new FailedSorzsSources(message);
	}

	view(): ReactNode {
		return (
			<p role="alert" className="text-error">
				{this.message}
			</p>
		);
	}
}
