import { Shield } from "lucide-react";
import { useGo } from "@/components/navigation/NavigationProvider";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function BackofficeButton() {
	const go = useGo();

	function enterBackoffice() {
		go("/backoffice/users");
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label="Backoffice"
						size="icon-sm"
						onClick={enterBackoffice}
					>
						<Shield aria-hidden="true" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Backoffice</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
