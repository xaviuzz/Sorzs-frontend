import { Header } from "@/components/header/Header";
import { SourceSideBar } from "@/components/sources/SourceSideBar";
import { SourcesProvider } from "@/components/sources/SourcesProvider";

export function App() {
	return (
		<SourcesProvider>
			<div className="flex min-h-screen flex-col">
				<Header />
				<div className="flex flex-1">
					<SourceSideBar />
				</div>
			</div>
		</SourcesProvider>
	);
}
