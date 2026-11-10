import type { PageInfo } from "@/api/sorzs/InspectSorz";
import { SorzFavicon } from "@/components/SorzFavicon";

export function InspectedFavicon({
	inspected,
	address,
}: {
	inspected: PageInfo | null;
	address: string;
}) {
	let shown = null;
	if (inspected !== null) {
		shown = <SorzFavicon favicon={inspected.favicon} text={address} />;
	}
	return shown;
}
