import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useListSorzsSources } from "@/api/ApiContext";
import { FailedSorzsSources } from "@/components/backoffice/sorzs/FailedSorzsSources";
import { LoadedSorzsSources } from "@/components/backoffice/sorzs/LoadedSorzsSources";
import { LoadingSorzsSources } from "@/components/backoffice/sorzs/LoadingSorzsSources";
import type { SorzsSourcesReading } from "@/components/backoffice/sorzs/SorzsSourcesReading";

interface SorzsSources {
	reading: SorzsSourcesReading;
}

const SorzsSourcesContext = createContext<SorzsSources | null>(null);

export function SorzsSourcesProvider({ children }: { children: ReactNode }) {
	const listSorzsSources = useListSorzsSources();
	const [reading, setReading] = useState<SorzsSourcesReading>(
		new LoadingSorzsSources(),
	);

	useEffect(() => {
		let isCurrent = true;
		listSorzsSources
			.run()
			.then((entries) => new LoadedSorzsSources(entries))
			.catch((error) => FailedSorzsSources.from(error))
			.then((loaded) => {
				if (isCurrent) {
					setReading(loaded);
				}
			});
		return () => {
			isCurrent = false;
		};
	}, [listSorzsSources]);

	return (
		<SorzsSourcesContext.Provider value={{ reading }}>
			{children}
		</SorzsSourcesContext.Provider>
	);
}

export function useSorzsSources() {
	const sources = useContext(SorzsSourcesContext);
	if (sources === null) {
		throw new Error("useSorzsSources needs a SorzsSourcesProvider");
	}
	return sources;
}
