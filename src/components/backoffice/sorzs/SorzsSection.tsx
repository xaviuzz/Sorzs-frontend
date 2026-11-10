import {
	CensusProvider,
	useCensus,
} from "@/components/backoffice/sorzs/CensusProvider";

function CensusReadingView() {
	const sorzs = useCensus();
	return sorzs.reading.view();
}

export function SorzsSection() {
	return (
		<CensusProvider>
			<CensusReadingView />
		</CensusProvider>
	);
}
