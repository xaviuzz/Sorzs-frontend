import { useState } from "react";
import { AddSorzForm } from "@/components/sorzs/add/AddSorzForm";
import { AddSorzTrigger } from "@/components/sorzs/add/AddSorzTrigger";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { SorzEntry } from "@/domain/SorzEntry";

export function AddSorzDialog({
	onAdded,
}: {
	onAdded: (entry: SorzEntry) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);

	function added(entry: SorzEntry) {
		onAdded(entry);
		setIsOpen(false);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<AddSorzTrigger />
			<DialogContent>
				<AddSorzForm onAdded={added} />
			</DialogContent>
		</Dialog>
	);
}
