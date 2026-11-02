import { AddressField } from "@/components/sources/add/AddressField";
import { AddSourceHeader } from "@/components/sources/add/AddSourceHeader";
import { AddSourceMessage } from "@/components/sources/add/AddSourceMessage";
import { NameField } from "@/components/sources/add/NameField";
import { useAddSourceForm } from "@/components/sources/add/useAddSourceForm";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import type { SourceEntry } from "@/domain/SourceEntry";

export function AddSourceForm({
	onAdded,
}: {
	onAdded: (entry: SourceEntry) => void;
}) {
	const form = useAddSourceForm(onAdded);

	return (
		<form onSubmit={form.submit} className="flex flex-col gap-4">
			<AddSourceHeader />
			<FieldGroup>
				<AddressField
					address={form.address}
					name={form.name}
					inspected={form.inspected}
					onType={form.typeAddress}
					onLeave={form.leaveAddress}
					onChoose={form.choose}
				/>
				<NameField
					name={form.name}
					address={form.address}
					inspected={form.inspected}
					onType={form.typeName}
				/>
			</FieldGroup>
			<AddSourceMessage message={form.message} />
			<DialogFooter>
				<Button type="submit" disabled={form.isSending}>
					Add
				</Button>
			</DialogFooter>
		</form>
	);
}
