import type { ReactNode } from "react";
import type { CensusReading } from "@/components/backoffice/sorzs/CensusReading";

export class LoadingCensus implements CensusReading {
	view(): ReactNode {
		return (
			<p role="status" className="col-span-2">
				Loading sorzs
			</p>
		);
	}
}
