import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

export function AddSourceTrigger() {
	return (
		<DialogTrigger asChild>
			<Button aria-label="Add Sorz" size="icon-sm">
				<span aria-hidden="true">
					<span className="text-base">
						<Brand>S</Brand>
					</span>
					+
				</span>
			</Button>
		</DialogTrigger>
	);
}
