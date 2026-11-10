import type { ReactNode } from "react";
import type { CensusReading } from "@/components/backoffice/sorzs/CensusReading";
import { messageOf } from "@/components/messageOf";

export class FailedCensus implements CensusReading {
	constructor(private readonly message: string) {}

	static from(error: unknown): FailedCensus {
		const message = messageOf(error, "Sorzs could not be loaded");
		return new FailedCensus(message);
	}

	view(): ReactNode {
		return (
			<p role="alert" className="col-span-2 text-error">
				{this.message}
			</p>
		);
	}
}
