import { UserCount } from "@/components/backoffice/sorzs/UserCount";
import { MarkedFavicon } from "@/components/MarkedFavicon";
import type { CensusEntry } from "@/domain/CensusEntry";

export function CensusRow({ entry }: { entry: CensusEntry }) {
	let faviconText: string | null = null;
	if (entry.favicon.isPresent()) faviconText = entry.favicon.address();

	return (
		<li className="-mx-2 grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md px-2 py-1 hover:bg-accent">
			<MarkedFavicon
				favicon={faviconText}
				text={entry.address}
				provider={entry.provider}
			/>
			<span>{entry.address}</span>
			<UserCount users={entry.users} />
		</li>
	);
}
