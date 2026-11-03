import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

function labelOf(users: number): string {
	let label = `${users} users`;
	if (users === 1) label = "1 user";
	return label;
}

export function UserCount({ users }: { users: number }) {
	const label = labelOf(users);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span role="img" aria-label={label} className="text-muted-foreground">
						{users}
					</span>
				</TooltipTrigger>
				<TooltipContent>{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
