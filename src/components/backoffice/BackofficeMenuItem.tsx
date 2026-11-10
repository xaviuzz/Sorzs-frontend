import type { LucideIcon } from "lucide-react";
import { IconTile } from "@/components/IconTile";
import { HIDDEN_WHEN_COLLAPSED } from "@/components/sorzs/reading/hiddenWhenCollapsed";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { BackofficeSection } from "@/domain/BackofficeSection";

export function BackofficeMenuItem({
	section,
	Icon,
	isActive,
	onChoose,
}: {
	section: BackofficeSection;
	Icon: LucideIcon;
	isActive: boolean;
	onChoose: () => void;
}) {
	const title = section.title();
	let current: "page" | undefined;
	if (isActive) {
		current = "page";
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				tooltip={title}
				isActive={isActive}
				aria-current={current}
				onClick={onChoose}
				className="h-10 gap-3"
			>
				<IconTile>
					<Icon aria-hidden="true" />
				</IconTile>
				<span className={HIDDEN_WHEN_COLLAPSED}>{title}</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
