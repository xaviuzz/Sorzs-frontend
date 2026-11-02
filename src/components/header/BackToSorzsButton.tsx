import { ArrowLeft } from "lucide-react";
import { useGo } from "@/components/navigation/NavigationProvider";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function BackToSorzsButton() {
	const go = useGo();

	function backToSorzs() {
		go("/");
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label="Back to Sorzs"
						size="icon-sm"
						onClick={backToSorzs}
					>
						<ArrowLeft aria-hidden="true" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Back to Sorzs</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
