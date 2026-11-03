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
		<li className="flex items-center gap-4">
			<span>{entry.username}</span>
			<span className="text-muted-foreground">{entry.role.text()}</span>
			<RoleChangeButton role={entry.role} onChange={change} />
			{message !== "" && (
				<p role="alert" className="text-error">
					{message}
				</p>
			)}
		</li>
	);
}
