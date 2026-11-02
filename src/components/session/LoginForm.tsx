import { LoginMessage } from "@/components/session/LoginMessage";
import { useLoginForm } from "@/components/session/useLoginForm";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm() {
	const form = useLoginForm();

	return (
		<form
			onSubmit={form.submit}
			className="flex w-full max-w-sm flex-col gap-4"
		>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="login-username">Username</FieldLabel>
					<Input
						id="login-username"
						value={form.username}
						onChange={form.typeUsername}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="login-password">Password</FieldLabel>
					<Input
						id="login-password"
						type="password"
						value={form.password}
						onChange={form.typePassword}
					/>
				</Field>
			</FieldGroup>
			<LoginMessage message={form.message} />
			<Button type="submit" disabled={form.isSending}>
				Enter
			</Button>
		</form>
	);
}
