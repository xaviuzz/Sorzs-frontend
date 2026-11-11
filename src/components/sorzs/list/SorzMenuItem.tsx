import { MarkedFavicon } from "@/components/MarkedFavicon";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { SorzEntry } from "@/domain/SorzEntry";

export function SorzMenuItem({ entry }: { entry: SorzEntry }) {
	const text = entry.shownText();

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild tooltip={text} className="h-10 gap-3">
				<span>
					<MarkedFavicon
						favicon={entry.favicon}
						text={text}
						provider={entry.provider}
					/>
					<span
						title={entry.address}
						className="group-data-[collapsible=icon]:hidden"
					>
						{text}
					</span>
				</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
