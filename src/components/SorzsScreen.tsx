import { Header } from "@/components/header/Header";
import { SearchProvider } from "@/components/search/SearchProvider";
import { SearchResultList } from "@/components/search/SearchResultList";
import { SourceSideBar } from "@/components/sources/list/SourceSideBar";
import { SourcesProvider } from "@/components/sources/SourcesProvider";

export function SorzsScreen() {
	return (
		<SourcesProvider>
			<SearchProvider>
				<div className="flex min-h-screen flex-col">
					<Header />
					<div className="flex flex-1">
						<SourceSideBar />
						<main className="flex-1 p-4">
							<SearchResultList />
						</main>
					</div>
				</div>
			</SearchProvider>
		</SourcesProvider>
	);
}
