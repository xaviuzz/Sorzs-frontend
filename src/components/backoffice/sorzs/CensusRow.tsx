import { UserCount } from "@/components/backoffice/sorzs/UserCount";
import { SorzFavicon } from "@/components/SorzFavicon";
import type { CensusEntry } from "@/domain/CensusEntry";

export function CensusRow({ entry }: { entry: CensusEntry }) {
	let faviconText: string | null = null;
	if (entry.favicon.isPresent()) faviconText = entry.favicon.address();

	return (
		<li className="-mx-2 grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md px-2 py-1 hover:bg-accent">
			<SorzFavicon favicon={faviconText} text={entry.address} />
			<span>{entry.address}</span>
			<UserCount users={entry.users} />
		</li>
	);
}
