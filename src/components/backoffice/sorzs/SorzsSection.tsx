import {
	SorzsSourcesProvider,
	useSorzsSources,
} from "@/components/backoffice/sorzs/SorzsSourcesProvider";

function SorzsSourcesReadingView() {
	const sources = useSorzsSources();
	return sources.reading.view();
}

export function SorzsSection() {
	return (
		<SorzsSourcesProvider>
			<SorzsSourcesReadingView />
		</SorzsSourcesProvider>
	);
}
