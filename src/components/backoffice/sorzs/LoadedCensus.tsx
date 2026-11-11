import type { ReactNode } from "react";
import type { CensusReading } from "@/components/backoffice/sorzs/CensusReading";
import { LoadedCensusView } from "@/components/backoffice/sorzs/LoadedCensusView";
import type { CensusEntry } from "@/domain/CensusEntry";

export class LoadedCensus implements CensusReading {
	constructor(private readonly entries: CensusEntry[]) {}

	view(): ReactNode {
		return <LoadedCensusView entries={this.entries} />;
	}
}
