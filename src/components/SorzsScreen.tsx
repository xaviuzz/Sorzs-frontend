import { Header } from "@/components/header/Header";
import { SearchProvider } from "@/components/search/SearchProvider";
import { SearchResultList } from "@/components/search/SearchResultList";
import { SorzSideBar } from "@/components/sorzs/list/SorzSideBar";
import { SorzsProvider } from "@/components/sorzs/SorzsProvider";

export function SorzsScreen() {
	return (
		<SorzsProvider>
			<SearchProvider>
				<div className="flex min-h-screen flex-col">
					<Header />
					<div className="flex flex-1">
						<SorzSideBar />
						<main className="flex-1 px-9 py-8">
							<SearchResultList />
						</main>
					</div>
				</div>
			</SearchProvider>
		</SorzsProvider>
	);
}
