import type { ReactNode } from "react";
import { SorzsSourceRow } from "@/components/backoffice/sorzs/SorzsSourceRow";
import type { SorzsSourcesReading } from "@/components/backoffice/sorzs/SorzsSourcesReading";
import type { SorzsSourceEntry } from "@/domain/SorzsSourceEntry";

export class LoadedSorzsSources implements SorzsSourcesReading {
	constructor(private readonly entries: SorzsSourceEntry[]) {}

	view(): ReactNode {
		return (
			<ul className="flex flex-col gap-2">
				{this.entries.map((entry) => (
					<SorzsSourceRow key={entry.address} entry={entry} />
				))}
			</ul>
		);
	}
}
