import type { FormEvent } from "react";
import type { PageInfo } from "@/api/sorzs/InspectSorz";
import { SideLabelField } from "@/components/SideLabelField";
import { InspectedFavicon } from "@/components/sorzs/add/InspectedFavicon";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function NameField({
	name,
	address,
	inspected,
	onType,
}: {
	name: string;
	address: string;
	inspected: PageInfo | null;
	onType: (event: FormEvent<HTMLInputElement>) => void;
}) {
	return (
		<SideLabelField>
			<FieldLabel htmlFor="sorz-name">Title</FieldLabel>
			<div className="flex items-center gap-2">
				<InspectedFavicon inspected={inspected} address={address} />
				<Input id="sorz-name" value={name} onChange={onType} />
			</div>
		</SideLabelField>
	);
}
