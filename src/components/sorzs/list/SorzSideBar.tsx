import { useSorzReading } from "@/components/sorzs/SorzsProvider";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export function SorzSideBar() {
	const reading = useSorzReading();

	return (
		<SidebarProvider className="relative min-h-0 w-auto">
			<Sidebar
				role="complementary"
				aria-label="Sorzs"
				collapsible="icon"
				className="absolute h-full"
			>
				<SidebarHeader className="px-3 py-1">
					<SidebarTrigger className="size-6 self-start" />
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>{reading.view()}</SidebarGroup>
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	);
}
