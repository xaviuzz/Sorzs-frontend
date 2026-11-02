import { LogOut } from "lucide-react";
import { useLeaveSession } from "@/components/session/SessionProvider";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function LogoutButton() {
	const leave = useLeaveSession();

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button aria-label="Log out" size="icon-sm" onClick={leave}>
						<LogOut aria-hidden="true" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Log out</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
