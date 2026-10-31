import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { SourceEntry } from "@/domain/SourceEntry";

export function SourceMenuItem({ entry }: { entry: SourceEntry }) {
	const initial = Array.from(entry.name)[0];

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild tooltip={entry.name}>
				<span>
					<span
						aria-hidden="true"
						className="hidden size-4 shrink-0 items-center justify-center group-data-[collapsible=icon]:flex"
					>
						{initial}
					</span>
					<span
						title={entry.address}
						className="group-data-[collapsible=icon]:hidden"
					>
						{entry.name}
					</span>
				</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
