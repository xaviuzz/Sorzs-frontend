import { useState } from "react";
import { AddUserForm } from "@/components/backoffice/users/AddUserForm";
import { AddUserTrigger } from "@/components/backoffice/users/AddUserTrigger";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function AddUserDialog() {
	const [isOpen, setIsOpen] = useState(false);

	function close() {
		setIsOpen(false);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<AddUserTrigger />
			<DialogContent>
				<AddUserForm onAdded={close} />
			</DialogContent>
		</Dialog>
	);
}
