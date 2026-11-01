import { useSearch } from "@/components/search/SearchProvider";

export function SearchResultList() {
	const search = useSearch();

	return search.reading.view();
}
