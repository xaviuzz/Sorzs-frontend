import { RoleChoice } from "@/components/backoffice/users/RoleChoice";
import { useAddUserForm } from "@/components/backoffice/users/useAddUserForm";
import { SideLabelField } from "@/components/SideLabelField";
import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function AddUserForm({ onAdded }: { onAdded: () => void }) {
	const form = useAddUserForm(onAdded);

	return (
		<form
			onSubmit={form.submit}
			className="flex min-w-0 flex-col gap-4 [--field-label-width:5rem]"
		>
			<DialogHeader className="text-left">
				<DialogTitle className="text-base leading-snug">Add user</DialogTitle>
				<DialogDescription className="sr-only">
					Give the new user a username, a password and a role.
				</DialogDescription>
			</DialogHeader>
			<FieldGroup className="gap-4">
				<SideLabelField>
					<FieldLabel htmlFor="user-username">Username</FieldLabel>
					<Input
						id="user-username"
						value={form.username}
						onChange={form.typeUsername}
					/>
				</SideLabelField>
				<SideLabelField>
					<FieldLabel htmlFor="user-password">Password</FieldLabel>
					<Input
						id="user-password"
						type="password"
						value={form.password}
						onChange={form.typePassword}
					/>
				</SideLabelField>
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
