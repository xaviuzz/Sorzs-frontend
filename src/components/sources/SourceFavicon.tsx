import { Globe } from "lucide-react";

const HIDDEN_WHEN_COLLAPSED = "group-data-[collapsible=icon]:hidden";

export function SourceFavicon({
	favicon,
	text,
}: {
	favicon: string | null;
	text: string;
}) {
	let icon = (
		<Globe
			role="img"
			aria-label="No favicon"
			className={`size-4 shrink-0 ${HIDDEN_WHEN_COLLAPSED}`}
		/>
	);
	if (favicon !== null) {
		icon = (
			<img
				src={favicon}
				alt={`Favicon of ${text}`}
				className={`size-4 shrink-0 ${HIDDEN_WHEN_COLLAPSED}`}
			/>
		);
	}
	return icon;
}
