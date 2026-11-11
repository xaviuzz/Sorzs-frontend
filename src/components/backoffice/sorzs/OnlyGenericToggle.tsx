import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function OnlyGenericToggle({
	isOn,
	onToggle,
}: {
	isOn: boolean;
	onToggle: () => void;
}) {
	return (
		<div className="flex items-center gap-2">
			<Switch id="only-generic" checked={isOn} onCheckedChange={onToggle} />
			<Label htmlFor="only-generic">Only generic provider</Label>
		</div>
	);
}
