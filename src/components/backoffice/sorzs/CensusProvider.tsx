import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useListCensus } from "@/api/ApiContext";
import type { CensusReading } from "@/components/backoffice/sorzs/CensusReading";
import { FailedCensus } from "@/components/backoffice/sorzs/FailedCensus";
import { LoadedCensus } from "@/components/backoffice/sorzs/LoadedCensus";
import { LoadingCensus } from "@/components/backoffice/sorzs/LoadingCensus";

interface Census {
	reading: CensusReading;
}

const CensusContext = createContext<Census | null>(null);

export function CensusProvider({ children }: { children: ReactNode }) {
	const listCensus = useListCensus();
	const [reading, setReading] = useState<CensusReading>(new LoadingCensus());

	useEffect(() => {
		let isCurrent = true;
		listCensus
			.run()
			.then((entries) => new LoadedCensus(entries))
			.catch((error) => FailedCensus.from(error))
			.then((loaded) => {
				if (isCurrent) {
					setReading(loaded);
				}
			});
		return () => {
			isCurrent = false;
		};
	}, [listCensus]);

	return (
		<CensusContext.Provider value={{ reading }}>
			{children}
		</CensusContext.Provider>
	);
}

export function useCensus() {
	const sorzs = useContext(CensusContext);
	if (sorzs === null) {
		throw new Error("useCensus needs a CensusProvider");
	}
	return sorzs;
}
