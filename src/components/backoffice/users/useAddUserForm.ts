import { type FormEvent, type SubmitEvent, useState } from "react";
import { useUsers } from "@/components/backoffice/users/UsersProvider";
import { messageOf } from "@/components/messageOf";
import type { Role } from "@/domain/Role";
import { UserRole } from "@/domain/UserRole";

export function useAddUserForm(onAdded: () => void) {
	const users = useUsers();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<Role>(new UserRole());
	const [isSending, setIsSending] = useState(false);
	const [message, setMessage] = useState("");

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		setIsSending(true);
		setMessage("");
		try {
			await users.add(username, password, role);
			onAdded();
		} catch (error) {
			setMessage(messageOf(error, "User could not be added"));
		} finally {
			setIsSending(false);
		}
	}

	function typeUsername(event: FormEvent<HTMLInputElement>) {
		setUsername(event.currentTarget.value);
	}

	function typePassword(event: FormEvent<HTMLInputElement>) {
		setPassword(event.currentTarget.value);
	}

	return {
		username,
		password,
		role,
		isSending,
		message,
		submit,
		typeUsername,
		typePassword,
		chooseRole: setRole,
	};
}
