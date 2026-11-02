import type { BackofficeSection } from "@/domain/BackofficeSection";

export class SorzsSection implements BackofficeSection {
	title(): string {
		return "Sorzs";
	}

	path(): string {
		return "/backoffice/sorzs";
	}

	is(other: BackofficeSection): boolean {
		return this.path() === other.path();
	}
}
