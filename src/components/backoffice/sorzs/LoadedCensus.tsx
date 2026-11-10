import type { ReactNode } from "react";
import type { CensusReading } from "@/components/backoffice/sorzs/CensusReading";
import { CensusRow } from "@/components/backoffice/sorzs/CensusRow";
import type { CensusEntry } from "@/domain/CensusEntry";

export class LoadedCensus implements CensusReading {
	constructor(private readonly entries: CensusEntry[]) {}

	view(): ReactNode {
		return (
			<ul className="col-span-2 flex flex-col">
				{this.entries.map((entry) => (
					<CensusRow key={entry.address} entry={entry} />
				))}
			</ul>
		);
	}
}
