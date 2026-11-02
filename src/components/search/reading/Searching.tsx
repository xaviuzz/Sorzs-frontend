import type { ReactNode } from "react";
import type { SearchReading } from "@/components/search/reading/SearchReading";

export class Searching implements SearchReading {
	view(): ReactNode {
		return <p role="status">Searching</p>;
	}
}
