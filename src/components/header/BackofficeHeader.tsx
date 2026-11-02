import { Brand } from "@/components/Brand";
import { BackToSorzsButton } from "@/components/header/BackToSorzsButton";
import { HealthMark } from "@/components/header/HealthMark";
import { LogoutButton } from "@/components/header/LogoutButton";

export function BackofficeHeader() {
	return (
		<header className="flex items-center gap-2 border-b p-4">
			<h1 className="text-2xl">
				<Brand>Sorzs</Brand>
			</h1>
			<HealthMark />
			<div className="ml-auto flex items-center gap-2">
				<BackToSorzsButton />
				<LogoutButton />
			</div>
		</header>
	);
}
