import { RoleChoice } from "@/components/backoffice/users/RoleChoice";
import { useAddUserForm } from "@/components/backoffice/users/useAddUserForm";
import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function AddUserForm({ onAdded }: { onAdded: () => void }) {
	const form = useAddUserForm(onAdded);

	return (
		<form onSubmit={form.submit} className="flex flex-col gap-4">
			<DialogHeader>
				<DialogTitle>Add user</DialogTitle>
				<DialogDescription className="sr-only">
					Give the new user a username, a password and a role.
				</DialogDescription>
			</DialogHeader>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="user-username">Username</FieldLabel>
					<Input
						id="user-username"
						value={form.username}
						onChange={form.typeUsername}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="user-password">Password</FieldLabel>
					<Input
						id="user-password"
						type="password"
						value={form.password}
						onChange={form.typePassword}
					/>
				</Field>
				<RoleChoice chosen={form.role} onChoose={form.chooseRole} />
			</FieldGroup>
			{form.message !== "" && (
				<p role="alert" className="text-error">
					{form.message}
				</p>
			)}
			<DialogFooter>
				<DialogClose asChild>
					<Button type="button" variant="outline">
						Cancel
					</Button>
				</DialogClose>
				<Button type="submit" disabled={form.isSending}>
					Add
				</Button>
			</DialogFooter>
		</form>
	);
}
