import { SourceFavicon } from "@/components/SourceFavicon";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { SourceEntry } from "@/domain/SourceEntry";

export function SourceMenuItem({ entry }: { entry: SourceEntry }) {
	const text = entry.shownText();

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild tooltip={text}>
				<span>
					<SourceFavicon favicon={entry.favicon} text={text} />
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
