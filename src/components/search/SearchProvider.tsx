import {
	createContext,
	type ReactNode,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import { useSearchSources } from "@/api/ApiContext";
import { FailedSearch } from "@/components/search/reading/FailedSearch";
import { FoundResults } from "@/components/search/reading/FoundResults";
import { NoSearchYet } from "@/components/search/reading/NoSearchYet";
import { Searching } from "@/components/search/reading/Searching";
import type { SearchReading } from "@/components/search/reading/SearchReading";

interface Search {
	query: string;
	reading: SearchReading;
	write: (query: string) => void;
	run: () => void;
}

const SearchContext = createContext<Search | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
	const searchSources = useSearchSources();
	const [query, setQuery] = useState("");
	const [reading, setReading] = useState<SearchReading>(new NoSearchYet());
	const latestSearch = useRef(0);

	const search = useMemo(() => {
		async function run() {
			latestSearch.current += 1;
			const thisSearch = latestSearch.current;
			setReading(new Searching());
			const answered = await searchSources
				.run(query)
				.then((results) => new FoundResults(results))
				.catch((error) => FailedSearch.from(error));
			if (thisSearch === latestSearch.current) {
				setReading(answered);
			}
		}
		return { query, reading, write: setQuery, run };
	}, [query, reading, searchSources]);

	return (
		<SearchContext.Provider value={search}>{children}</SearchContext.Provider>
	);
}

export function useSearch() {
	const search = useContext(SearchContext);
	if (search === null) {
		throw new Error("useSearch needs a SearchProvider");
	}
	return search;
}
