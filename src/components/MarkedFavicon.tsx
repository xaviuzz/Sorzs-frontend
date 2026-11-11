import { ProviderMark } from "@/components/ProviderMark";
import { SorzFavicon } from "@/components/SorzFavicon";
import type { SearchProvider } from "@/domain/SearchProvider";

export function MarkedFavicon({
	favicon,
	text,
	provider,
}: {
	favicon: string | null;
	text: string;
	provider: SearchProvider;
}) {
	return (
		<span className="relative shrink-0">
			<SorzFavicon favicon={favicon} text={text} />
			<ProviderMark provider={provider} />
		</span>
	);
}
