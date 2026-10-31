import { useEffect, useState } from "react";
import { useListSources } from "@/api/ApiContext";
import { AddSourceDialog } from "@/components/sources/AddSourceDialog";
import {
	FailedSources,
	LoadedSources,
	LoadingSources,
	type SourceReading,
} from "@/components/sources/SourceReading";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import type { SourceEntry } from "@/domain/SourceEntry";

export function SourceSideBar() {
	const listSources = useListSources();
	const [reading, setReading] = useState<SourceReading>(new LoadingSources());

	useEffect(() => {
		let isCurrent = true;
		listSources
			.run()
			.then((entries) => new LoadedSources(entries))
			.catch((error) => FailedSources.from(error))
			.then((loaded) => {
				if (isCurrent) {
					setReading(loaded);
				}
			});
		return () => {
			isCurrent = false;
		};
	}, [listSources]);

	function appendToReading(entry: SourceEntry) {
		setReading((current) => current.append(entry));
	}

	return (
		<SidebarProvider className="relative min-h-0 w-auto">
			<Sidebar
				role="complementary"
				aria-label="Sources"
				collapsible="icon"
				className="absolute h-full"
			>
				<SidebarHeader>
					<SidebarTrigger />
					<AddSourceDialog onAdded={appendToReading} />
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>{reading.view()}</SidebarGroup>
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	);
}
