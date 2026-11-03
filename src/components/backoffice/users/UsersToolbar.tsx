import { AddUserDialog } from "@/components/backoffice/users/AddUserDialog";

export function UsersToolbar() {
	return (
		<div className="col-start-2 row-start-1 flex gap-2">
			<AddUserDialog />
		</div>
	);
}
