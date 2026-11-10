import { SorzFavicon } from "@/components/SorzFavicon";
import { useSorzReading } from "@/components/sorzs/SorzsProvider";
import type { SearchResult } from "@/domain/SearchResult";

export function SearchResultItem({ result }: { result: SearchResult }) {
	const reading = useSorzReading();
	const favicon = reading.faviconOf(result.sorz);

	return (
		<li>
			<a
				href={result.url}
				target="_blank"
				rel="noopener noreferrer"
				className="group -mx-3 flex flex-col gap-0.5 rounded-md px-3 py-2 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
			>
				<span className="flex items-center gap-2 text-muted-foreground">
					<SorzFavicon favicon={favicon} text={result.sorz} />
					{result.sorz}
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
