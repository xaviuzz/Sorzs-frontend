import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function AddUserTrigger() {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button aria-label="Add user" size="icon-sm">
							<UserPlus aria-hidden="true" />
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>Add user</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
