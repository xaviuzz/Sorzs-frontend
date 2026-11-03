import type { ReactNode } from "react";
import { UsersSection } from "@/components/backoffice/users/UsersSection";
import type { BackofficeSection } from "@/domain/BackofficeSection";
import { UsersSection as UsersBackofficeSection } from "@/domain/UsersSection";

export function sectionContentOf(section: BackofficeSection): ReactNode {
	let content: ReactNode = null;
	if (section.is(new UsersBackofficeSection())) {
		content = <UsersSection />;
	}
	return content;
}
