import { useState } from "react";
import { CensusRow } from "@/components/backoffice/sorzs/CensusRow";
import { OnlyGenericToggle } from "@/components/backoffice/sorzs/OnlyGenericToggle";
import type { CensusEntry } from "@/domain/CensusEntry";

function shownOf(entries: CensusEntry[], onlyGeneric: boolean): CensusEntry[] {
	const shown: CensusEntry[] = [];
	for (const entry of entries) {
		const isShown = !onlyGeneric || entry.isGeneric();
		if (isShown) shown.push(entry);
	}
	return shown;
}

export function LoadedCensusView({ entries }: { entries: CensusEntry[] }) {
	const [onlyGeneric, setOnlyGeneric] = useState(false);
	const toggleOnlyGeneric = () => setOnlyGeneric(!onlyGeneric);
	const shown = shownOf(entries, onlyGeneric);

	return (
		<>
			<div className="col-start-2 row-start-1 flex gap-2">
				<OnlyGenericToggle isOn={onlyGeneric} onToggle={toggleOnlyGeneric} />
			</div>
			<ul className="col-span-2 flex flex-col">
				{shown.map((entry) => (
					<CensusRow key={entry.address} entry={entry} />
				))}
			</ul>
		</>
	);
}
