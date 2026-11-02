import { Globe, Users } from "lucide-react";
import { BackofficeMenuItem } from "@/components/backoffice/BackofficeMenuItem";
import { useGo } from "@/components/navigation/NavigationProvider";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import type { BackofficeSection } from "@/domain/BackofficeSection";
import { SorzsSection } from "@/domain/SorzsSection";
import { UsersSection } from "@/domain/UsersSection";

const entries = [
	{ section: new UsersSection(), Icon: Users },
	{ section: new SorzsSection(), Icon: Globe },
];

export function BackofficeSideBar({ active }: { active: BackofficeSection }) {
	const go = useGo();
	const items = [];
	for (const { section, Icon } of entries) {
		function choose() {
			go(section.path());
		}
		items.push(
			<BackofficeMenuItem
				key={section.path()}
				section={section}
				Icon={Icon}
				isActive={active.is(section)}
				onChoose={choose}
			/>,
		);
	}

	return (
		<SidebarProvider className="relative min-h-0 w-auto">
			<Sidebar
				role="complementary"
				aria-label="Backoffice"
				collapsible="icon"
				className="absolute h-full"
			>
				<SidebarHeader>
					<SidebarTrigger className="size-8 self-start" />
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu>{items}</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	);
}
