import type { FormEvent } from "react";
import type { PageInfo } from "@/api/sources/InspectSource";
import { InspectedFavicon } from "@/components/sources/add/InspectedFavicon";
import { Field, FieldLabel } from "@/components/ui/field";
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
		<Field>
			<FieldLabel htmlFor="source-name">Title</FieldLabel>
			<div className="flex items-center gap-2">
				<InspectedFavicon inspected={inspected} address={address} />
				<Input id="source-name" value={name} onChange={onType} />
			</div>
		</Field>
	);
}
