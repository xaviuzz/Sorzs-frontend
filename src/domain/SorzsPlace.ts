import type { Place, PlaceChoices } from "@/domain/Place";

export class SorzsPlace implements Place {
	constructor(private readonly where: string) {}

	path(): string {
		return this.where;
	}

	choose<R>(choices: PlaceChoices<R>): R {
		return choices.sorzs();
	}
}
