import { ChevronDown, ChevronUp, type LucideIcon, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Role } from "@/domain/Role";

const CARETS: Record<string, LucideIcon> = {
	user: ChevronUp,
	admin: ChevronDown,
};

export function RoleChangeButton({
	role,
	onChange,
}: {
	role: Role;
	onChange: () => void;
}) {
	const label = role.changeLabel();
	const Caret = CARETS[role.text()] as LucideIcon;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button aria-label={label} size="icon-sm" onClick={onChange}>
						<span className="relative inline-flex" aria-hidden="true">
							<Shield />
							<Caret className="absolute inset-0 m-auto size-2.5" />
						</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
