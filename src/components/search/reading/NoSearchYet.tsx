import type { ReactNode } from "react";
import type { SearchReading } from "@/components/search/reading/SearchReading";

export class NoSearchYet implements SearchReading {
	view(): ReactNode {
		return null;
	}
}
