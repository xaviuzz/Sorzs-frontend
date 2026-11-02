import type { ChangeEvent, SubmitEvent } from "react";
import { useSearch } from "@/components/search/SearchProvider";
import { useSourceReading } from "@/components/sources/SourcesProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBox() {
	const search = useSearch();
	const reading = useSourceReading();
	const isBlank = search.query.trim() === "";
	const hasNoSources = !reading.hasSources();
	const cannotSearch = isBlank || hasNoSources;

	function writeIt(event: ChangeEvent<HTMLInputElement>) {
		search.write(event.target.value);
	}

	function searchIt(event: SubmitEvent) {
		event.preventDefault();
		if (cannotSearch) return;
		search.run();
	}

	return (
		<search>
			<form onSubmit={searchIt} className="flex gap-2">
				<Input aria-label="Query" value={search.query} onChange={writeIt} />
				<Button type="submit" disabled={cannotSearch}>
					Search
				</Button>
			</form>
		</search>
	);
}
