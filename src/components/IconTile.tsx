import type { ReactNode } from "react";

export function IconTile({ children }: { children: ReactNode }) {
	return (
		<span className="grid size-6 shrink-0 place-items-center rounded-sm border border-sidebar-border bg-background group-data-[collapsible=icon]:size-4 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent [&_svg]:size-4">
			{children}
		</span>
	);
}
