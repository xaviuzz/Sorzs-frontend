import { AddUserDialog } from "@/components/backoffice/users/AddUserDialog";

export function UsersToolbar() {
	return (
		<div className="flex gap-2">
			<AddUserDialog />
		</div>
	);
}
