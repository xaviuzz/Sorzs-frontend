import type { FormEvent } from "react";
import type { PageInfo } from "@/api/sorzs/InspectSorz";
import { SideLabelField } from "@/components/SideLabelField";
import { CandidateList } from "@/components/sorzs/add/CandidateList";
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
			<FieldLabel htmlFor="sorz-address">URL</FieldLabel>
			<Input
				id="sorz-address"
				value={address}
				onChange={onType}
				onBlur={onLeave}
			/>
			{showCandidates()}
		</SideLabelField>
	);
}
