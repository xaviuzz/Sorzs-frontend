import { useState } from "react";
import { AddSourceForm } from "@/components/sources/add/AddSourceForm";
import { AddSourceTrigger } from "@/components/sources/add/AddSourceTrigger";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { SourceEntry } from "@/domain/SourceEntry";

export function AddSourceDialog({
	onAdded,
}: {
	onAdded: (entry: SourceEntry) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);

	function added(entry: SourceEntry) {
		onAdded(entry);
		setIsOpen(false);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<AddSourceTrigger />
			<DialogContent>
				<AddSourceForm onAdded={added} />
			</DialogContent>
		</Dialog>
	);
}
