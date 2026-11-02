import { Brand } from "@/components/Brand";
import { HealthMark } from "@/components/header/HealthMark";
import { LogoutButton } from "@/components/header/LogoutButton";
import { SearchBox } from "@/components/search/SearchBox";
import { AddSourceDialog } from "@/components/sources/add/AddSourceDialog";
import { useAppendSource } from "@/components/sources/SourcesProvider";

export function Header() {
	const appendSource = useAppendSource();

	return (
		<header className="flex items-center gap-2 border-b p-4">
			<h1 className="text-2xl">
				<Brand>Sorzs</Brand>
			</h1>
			<HealthMark />
			<div className="mx-auto w-full max-w-xl">
				<SearchBox />
			</div>
			<div className="flex items-center gap-2">
				<AddSourceDialog onAdded={appendSource} />
				<LogoutButton />
			</div>
		</header>
	);
}
