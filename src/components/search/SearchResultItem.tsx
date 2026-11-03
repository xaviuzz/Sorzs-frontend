import { SourceFavicon } from "@/components/SourceFavicon";
import { useSourceReading } from "@/components/sources/SourcesProvider";
import type { SearchResult } from "@/domain/SearchResult";

export function SearchResultItem({ result }: { result: SearchResult }) {
	const reading = useSourceReading();
	const favicon = reading.faviconOf(result.source);

	return (
		<li>
			<a
				href={result.url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex flex-col gap-1"
			>
				<span className="flex items-center gap-2 text-muted-foreground">
					<SourceFavicon favicon={favicon} text={result.source} />
					{result.source}
				</span>
				<span className="text-lg">{result.title}</span>
				<span className="text-muted-foreground">{result.description}</span>
			</a>
		</li>
	);
}
