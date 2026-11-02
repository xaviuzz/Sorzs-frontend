import type { BackofficeSection } from "@/domain/BackofficeSection";

export type PlaceChoices<R> = {
	sorzs: () => R;
	backoffice: (section: BackofficeSection) => R;
};

export interface Place {
	path(): string;
	choose<R>(choices: PlaceChoices<R>): R;
}
