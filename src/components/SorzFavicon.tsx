import { Globe } from "lucide-react";
import { IconTile } from "@/components/IconTile";

export function SorzFavicon({
	favicon,
	text,
}: {
	favicon: string | null;
	text: string;
}) {
	let icon = (
		<Globe role="img" aria-label="No favicon" className="size-4 shrink-0" />
	);
	if (favicon !== null) {
		icon = (
			<img
				src={favicon}
				alt={`Favicon of ${text}`}
				className="size-4 shrink-0"
			/>
		);
	}
	return <IconTile>{icon}</IconTile>;
}
