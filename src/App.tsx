import { Header } from "@/components/header/Header";
import { SourceSideBar } from "@/components/sources/SourceSideBar";

export function App() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<div className="flex flex-1">
				<SourceSideBar />
			</div>
		</div>
	);
}
