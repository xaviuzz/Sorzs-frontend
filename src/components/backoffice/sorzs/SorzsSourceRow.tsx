import { UserCount } from "@/components/backoffice/sorzs/UserCount";
import { SourceFavicon } from "@/components/SourceFavicon";
import type { SorzsSourceEntry } from "@/domain/SorzsSourceEntry";

export function SorzsSourceRow({ entry }: { entry: SorzsSourceEntry }) {
	let faviconText: string | null = null;
	if (entry.favicon.isPresent()) faviconText = entry.favicon.address();

	return (
		<li className="-mx-2 grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md px-2 py-1 hover:bg-accent">
			<SourceFavicon favicon={faviconText} text={entry.address} />
			<span>{entry.address}</span>
			<UserCount users={entry.users} />
		</li>
	);
}
