import { AddressField } from "@/components/sorzs/add/AddressField";
import { AddSorzHeader } from "@/components/sorzs/add/AddSorzHeader";
import { AddSorzMessage } from "@/components/sorzs/add/AddSorzMessage";
import { NameField } from "@/components/sorzs/add/NameField";
import { useAddSorzForm } from "@/components/sorzs/add/useAddSorzForm";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import type { SorzEntry } from "@/domain/SorzEntry";

export function AddSorzForm({
	onAdded,
}: {
	onAdded: (entry: SorzEntry) => void;
}) {
	const form = useAddSorzForm(onAdded);

	return (
		<form onSubmit={form.submit} className="flex min-w-0 flex-col gap-4">
			<AddSorzHeader />
			<FieldGroup className="gap-4">
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
			<AddSorzMessage message={form.message} />
			<DialogFooter>
				<Button type="submit" disabled={form.isSending}>
					Add
				</Button>
			</DialogFooter>
		</form>
	);
}
