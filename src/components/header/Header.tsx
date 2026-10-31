import { HealthMark } from "@/components/header/HealthMark";

export function Header() {
	return (
		<header className="flex items-center gap-2 border-b p-4">
			<h1 className="font-script text-3xl">Sorzs</h1>
			<HealthMark />
		</header>
	);
}
