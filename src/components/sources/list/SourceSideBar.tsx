import { useSourceReading } from "@/components/sources/SourcesProvider";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export function SourceSideBar() {
	const reading = useSourceReading();

	return (
		<SidebarProvider className="relative min-h-0 w-auto">
			<Sidebar
				role="complementary"
				aria-label="Sources"
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
