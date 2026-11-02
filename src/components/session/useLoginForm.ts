import { type FormEvent, type SubmitEvent, useState } from "react";
import { useLogin } from "@/api/ApiContext";
import { messageOf } from "@/components/messageOf";
import { useEnterSession } from "@/components/session/SessionProvider";

export function useLoginForm() {
	const login = useLogin();
	const enter = useEnterSession();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [message, setMessage] = useState("");

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		setIsSending(true);
		setMessage("");
		try {
			const token = await login.run(username, password);
			enter(token);
		} catch (error) {
			setMessage(messageOf(error, "Could not log in"));
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
		isSending,
		message,
		submit,
		typeUsername,
		typePassword,
	};
}
