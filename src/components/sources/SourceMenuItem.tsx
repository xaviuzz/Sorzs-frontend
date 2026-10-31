import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { SourceEntry } from "@/domain/SourceEntry";

export function SourceMenuItem({ entry }: { entry: SourceEntry }) {
	const text = entry.name ?? entry.address;
	const initial = Array.from(text)[0];

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild tooltip={text}>
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
						{text}
					</span>
				</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
