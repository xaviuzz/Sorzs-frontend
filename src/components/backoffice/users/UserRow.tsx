import { useState } from "react";
import { RoleChangeButton } from "@/components/backoffice/users/RoleChangeButton";
import { useUsers } from "@/components/backoffice/users/UsersProvider";
import { messageOf } from "@/components/messageOf";
import type { UserEntry } from "@/domain/UserEntry";

export function UserRow({ entry }: { entry: UserEntry }) {
	const users = useUsers();
	const [message, setMessage] = useState("");

	async function change() {
		setMessage("");
		try {
			await users.setRole(entry.username, entry.role.opposite());
		} catch (error) {
			setMessage(messageOf(error, "Role could not be changed"));
		}
	}

	return (
		<li className="-mx-2 grid grid-cols-[var(--user-name-width)_var(--user-role-width)_1fr] [&>button]:justify-self-end items-center gap-4 rounded-md px-2 py-1 hover:bg-accent">
			<span>{entry.username}</span>
			<span className="text-muted-foreground">{entry.role.text()}</span>
			<RoleChangeButton role={entry.role} onChange={change} />
			{message !== "" && (
				<p role="alert" className="col-span-3 text-error">
					{message}
				</p>
			)}
		</li>
	);
}
