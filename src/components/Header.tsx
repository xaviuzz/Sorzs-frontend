import { HealthMark } from "@/components/HealthMark";

export function Header() {
	return (
		<header className="flex items-center gap-2 border-b p-4">
			<h1 className="text-xl font-semibold">Sorzs</h1>
			<HealthMark />
		</header>
	);
}
