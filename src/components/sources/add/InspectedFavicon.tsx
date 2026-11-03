import type { PageInfo } from "@/api/sources/InspectSource";
import { SourceFavicon } from "@/components/SourceFavicon";

export function InspectedFavicon({
	inspected,
	address,
}: {
	inspected: PageInfo | null;
	address: string;
}) {
	let shown = null;
	if (inspected !== null) {
		shown = <SourceFavicon favicon={inspected.favicon} text={address} />;
	}
	return shown;
}
