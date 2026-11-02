export interface BackofficeSection {
	title(): string;
	path(): string;
	is(other: BackofficeSection): boolean;
}
