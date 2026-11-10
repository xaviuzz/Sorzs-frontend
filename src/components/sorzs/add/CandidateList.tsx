import { SorzFavicon } from "@/components/SorzFavicon";
import { Button } from "@/components/ui/button";
import type { AddressCandidate } from "@/domain/AddressCandidate";

const MINIMUM_TO_CHOOSE = 2;

export function CandidateList({
	candidates,
	address,
	name,
	onChoose,
}: {
	candidates: AddressCandidate[];
	address: string;
	name: string;
	onChoose: (candidate: AddressCandidate) => void;
}) {
	const items = [];
	for (const candidate of candidates) {
		items.push(
			<li key={candidate.address}>
				<CandidateButton
					candidate={candidate}
					isChosen={candidate.isChosenBy(address, name)}
					onChoose={onChoose}
				/>
			</li>,
		);
	}
	let shown = null;
	if (candidates.length >= MINIMUM_TO_CHOOSE) {
		shown = (
			<ul aria-label="Candidates" className="flex flex-col gap-1">
				{items}
			</ul>
		);
	}
	return shown;
}

function CandidateButton({
	candidate,
	isChosen,
	onChoose,
}: {
	candidate: AddressCandidate;
	isChosen: boolean;
	onChoose: (candidate: AddressCandidate) => void;
}) {
	let variant: "secondary" | "ghost" = "ghost";
	if (isChosen) variant = "secondary";

	function choose() {
		onChoose(candidate);
	}

	return (
		<Button
			type="button"
			variant={variant}
			aria-pressed={isChosen}
			title={candidate.address}
			onClick={choose}
			className="w-full min-w-0 justify-start"
		>
			<span aria-hidden="true">
				<SorzFavicon favicon={candidate.favicon} text={candidate.title} />
			</span>
			<span className="truncate">{candidate.suggestedName()}</span>
		</Button>
	);
}
