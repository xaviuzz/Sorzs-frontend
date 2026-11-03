import { Brand } from "@/components/Brand";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export function AddSourceHeader() {
	return (
		<DialogHeader className="text-left">
			<DialogTitle>
				Add <Brand>Sorz</Brand>
			</DialogTitle>
			<DialogDescription className="sr-only">
				Register the URL of a site you trust and give it a title.
			</DialogDescription>
		</DialogHeader>
	);
}
