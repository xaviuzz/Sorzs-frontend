export function SorzDidNotAnswer({ sorz }: { sorz: string }) {
	return (
		<li className="text-muted-foreground text-result-description">
			{sorz} did not answer
		</li>
	);
}
