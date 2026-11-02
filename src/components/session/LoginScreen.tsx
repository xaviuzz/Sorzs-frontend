import { Brand } from "@/components/Brand";
import { LoginForm } from "@/components/session/LoginForm";

export function LoginScreen() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
			<h1 className="text-2xl">
				<Brand>Sorzs</Brand>
			</h1>
			<LoginForm />
		</main>
	);
}
