import { useEffect, useState } from "react";
import { useListSources } from "@/api/ApiContext";
import { AddSourceDialog } from "@/components/AddSourceDialog";
import {
	FailedSources,
	LoadedSources,
	LoadingSources,
	type SourceReading,
} from "@/components/SourceReading";
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
		<aside
			aria-label="Sources"
			className="flex w-64 flex-col gap-4 border-r p-4"
		>
			<AddSourceDialog onAdded={appendToReading} />
			{reading.view()}
		</aside>
	);
}
