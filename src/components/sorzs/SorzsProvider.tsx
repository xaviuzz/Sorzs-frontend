import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useListSorzs } from "@/api/ApiContext";
import { FailedSorzs } from "@/components/sorzs/reading/FailedSorzs";
import { LoadedSorzs } from "@/components/sorzs/reading/LoadedSorzs";
import { LoadingSorzs } from "@/components/sorzs/reading/LoadingSorzs";
import type { SorzReading } from "@/components/sorzs/reading/SorzReading";
import type { SorzEntry } from "@/domain/SorzEntry";

interface Sorzs {
	reading: SorzReading;
	append: (entry: SorzEntry) => void;
}

const SorzsContext = createContext<Sorzs | null>(null);

export function SorzsProvider({ children }: { children: ReactNode }) {
	const listSorzs = useListSorzs();
	const [reading, setReading] = useState<SorzReading>(new LoadingSorzs());

	useEffect(() => {
		let isCurrent = true;
		listSorzs
			.run()
			.then((entries) => new LoadedSorzs(entries))
			.catch((error) => FailedSorzs.from(error))
			.then((loaded) => {
				if (isCurrent) {
					setReading(loaded);
				}
			});
		return () => {
			isCurrent = false;
		};
	}, [listSorzs]);

	const sorzs = useMemo(() => {
		function append(entry: SorzEntry) {
			setReading((current) => current.append(entry));
		}
		return { reading, append };
	}, [reading]);

	return (
		<SorzsContext.Provider value={sorzs}>{children}</SorzsContext.Provider>
	);
}

export function useSorzReading() {
	const sorzs = useContext(SorzsContext);
	if (sorzs === null) {
		throw new Error("useSorzReading needs a SorzsProvider");
	}
	return sorzs.reading;
}

export function useAppendSorz() {
	const sorzs = useContext(SorzsContext);
	if (sorzs === null) {
		throw new Error("useAppendSorz needs a SorzsProvider");
	}
	return sorzs.append;
}
