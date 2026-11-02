import type { BackofficeSection } from "@/domain/BackofficeSection";

export class UsersSection implements BackofficeSection {
	title(): string {
		return "Users";
	}

	path(): string {
		return "/backoffice/users";
	}

	is(other: BackofficeSection): boolean {
		return this.path() === other.path();
	}
}
