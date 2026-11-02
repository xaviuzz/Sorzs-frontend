import type { BackofficeSection } from "@/domain/BackofficeSection";
import { SorzsSection } from "@/domain/SorzsSection";
import { UsersSection } from "@/domain/UsersSection";

export function allSections(): BackofficeSection[] {
	return [new UsersSection(), new SorzsSection()];
}

export function sectionAt(path: string): BackofficeSection {
	const matching = allSections().find((section) => section.path() === path);
	let section: BackofficeSection = new UsersSection();
	if (matching !== undefined) {
		section = matching;
	}
	return section;
}
