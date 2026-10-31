import { Header } from "@/components/Header";
import { SourceSideBar } from "@/components/SourceSideBar";

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
