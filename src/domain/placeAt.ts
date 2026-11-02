import { BackofficePlace } from "@/domain/BackofficePlace";
import { sectionAt } from "@/domain/backofficeSections";
import type { Place } from "@/domain/Place";
import { SorzsPlace } from "@/domain/SorzsPlace";

const BACKOFFICE = "/backoffice";

export function placeAt(path: string, mayEnterBackoffice: boolean): Place {
	const isBackoffice = path === BACKOFFICE || path.startsWith(`${BACKOFFICE}/`);
	let place: Place = new SorzsPlace(path);
	if (isBackoffice) {
		place = new SorzsPlace("/");
	}
	if (isBackoffice && mayEnterBackoffice) {
		place = new BackofficePlace(sectionAt(path));
	}
	return place;
}
