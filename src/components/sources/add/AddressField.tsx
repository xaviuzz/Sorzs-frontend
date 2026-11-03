import type { FormEvent } from "react";
import type { PageInfo } from "@/api/sources/InspectSource";
import { CandidateList } from "@/components/sources/add/CandidateList";
import { SideLabelField } from "@/components/sources/add/SideLabelField";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AddressCandidate } from "@/domain/AddressCandidate";

export function AddressField({
	address,
	name,
	inspected,
	onType,
	onLeave,
	onChoose,
}: {
	address: string;
	name: string;
	inspected: PageInfo | null;
	onType: (event: FormEvent<HTMLInputElement>) => void;
	onLeave: () => void;
	onChoose: (candidate: AddressCandidate) => void;
}) {
	function showCandidates() {
		let shown = null;
		if (inspected !== null) {
			shown = (
				<CandidateList
					candidates={inspected.candidates}
					address={address}
					name={name}
					onChoose={onChoose}
				/>
			);
		}
		return shown;
	}

	return (
		<SideLabelField>
			<FieldLabel htmlFor="source-address">URL</FieldLabel>
			<Input
				id="source-address"
				value={address}
				onChange={onType}
				onBlur={onLeave}
			/>
			{showCandidates()}
		</SideLabelField>
	);
}
