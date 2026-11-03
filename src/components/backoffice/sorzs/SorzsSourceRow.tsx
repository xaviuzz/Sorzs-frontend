import { UserCount } from "@/components/backoffice/sorzs/UserCount";
import { SourceFavicon } from "@/components/SourceFavicon";
import type { SorzsSourceEntry } from "@/domain/SorzsSourceEntry";

export function SorzsSourceRow({ entry }: { entry: SorzsSourceEntry }) {
	let faviconText: string | null = null;
	if (entry.favicon.isPresent()) faviconText = entry.favicon.address();

	return (
		<li className="flex items-center gap-4">
			<SourceFavicon favicon={faviconText} text={entry.address} />
			<span className="flex-1">{entry.address}</span>
			<UserCount users={entry.users} />
		</li>
	);
}
