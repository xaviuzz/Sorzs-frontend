import { BadgeCheck } from "lucide-react";
import type { SearchProvider } from "@/domain/SearchProvider";

export function ProviderMark({ provider }: { provider: SearchProvider }) {
	const hint = provider.hint();
	let mark = null;
	if (provider.isSpecific()) {
		mark = (
			<span
				role="img"
				aria-label={hint}
				title={hint}
				className="absolute -right-1 -bottom-1 grid size-3 place-items-center rounded-full bg-background text-primary"
			>
				<BadgeCheck className="size-3" />
			</span>
		);
	}
	return mark;
}
