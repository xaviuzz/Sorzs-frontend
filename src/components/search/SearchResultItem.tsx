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
				className="group -mx-3 flex flex-col gap-0.5 rounded-md px-3 py-2 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
			>
				<span className="flex items-center gap-2 text-muted-foreground">
					<SourceFavicon favicon={favicon} text={result.source} />
					{result.source}
				</span>
				<span className="text-primary text-result-title group-hover:underline group-hover:underline-offset-4">
					{result.title}
				</span>
				<span className="text-muted-foreground text-result-description">
					{result.description}
				</span>
			</a>
		</li>
	);
}
