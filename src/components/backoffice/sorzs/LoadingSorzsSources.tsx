import type { ReactNode } from "react";
import type { SorzsSourcesReading } from "@/components/backoffice/sorzs/SorzsSourcesReading";

export class LoadingSorzsSources implements SorzsSourcesReading {
	view(): ReactNode {
		return <p role="status">Loading sources</p>;
	}
}
