import type { BackofficeSection } from "@/domain/BackofficeSection";
import type { Place, PlaceChoices } from "@/domain/Place";

export class BackofficePlace implements Place {
	constructor(private readonly section: BackofficeSection) {}

	path(): string {
		return this.section.path();
	}

	choose<R>(choices: PlaceChoices<R>): R {
		return choices.backoffice(this.section);
	}
}
