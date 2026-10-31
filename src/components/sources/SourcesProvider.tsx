import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useListSources } from "@/api/ApiContext";
import {
	FailedSources,
	LoadedSources,
	LoadingSources,
	type SourceReading,
} from "@/components/sources/SourceReading";
import type { SourceEntry } from "@/domain/SourceEntry";

interface Sources {
	reading: SourceReading;
	append: (entry: SourceEntry) => void;
}

const SourcesContext = createContext<Sources | null>(null);

export function SourcesProvider({ children }: { children: ReactNode }) {
	const listSources = useListSources();
	const [reading, setReading] = useState<SourceReading>(new LoadingSources());

	useEffect(() => {
		let isCurrent = true;
		listSources
			.run()
			.then((entries) => new LoadedSources(entries))
			.catch((error) => FailedSources.from(error))
			.then((loaded) => {
				if (isCurrent) {
					setReading(loaded);
				}
			});
		return () => {
			isCurrent = false;
		};
	}, [listSources]);

	const sources = useMemo(() => {
		function append(entry: SourceEntry) {
			setReading((current) => current.append(entry));
		}
		return { reading, append };
	}, [reading]);

	return (
		<SourcesContext.Provider value={sources}>
			{children}
		</SourcesContext.Provider>
	);
}

export function useSourceReading() {
	const sources = useContext(SourcesContext);
	if (sources === null) {
		throw new Error("useSourceReading needs a SourcesProvider");
	}
	return sources.reading;
}

export function useAppendSource() {
	const sources = useContext(SourcesContext);
	if (sources === null) {
		throw new Error("useAppendSource needs a SourcesProvider");
	}
	return sources.append;
}
