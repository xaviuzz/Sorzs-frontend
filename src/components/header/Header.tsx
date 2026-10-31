import { Brand } from "@/components/Brand";
import { HealthMark } from "@/components/header/HealthMark";
import { AddSourceDialog } from "@/components/sources/AddSourceDialog";
import { useAppendSource } from "@/components/sources/SourcesProvider";

export function Header() {
	const appendSource = useAppendSource();

	return (
		<header className="flex items-center gap-2 border-b p-4">
			<h1 className="text-2xl">
				<Brand>Sorzs</Brand>
			</h1>
			<HealthMark />
			<div className="ml-auto">
				<AddSourceDialog onAdded={appendSource} />
			</div>
		</header>
	);
}
