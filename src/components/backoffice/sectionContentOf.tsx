import type { ReactNode } from "react";
import { SorzsSection } from "@/components/backoffice/sorzs/SorzsSection";
import { UsersSection } from "@/components/backoffice/users/UsersSection";
import type { BackofficeSection } from "@/domain/BackofficeSection";
import { SorzsSection as SorzsBackofficeSection } from "@/domain/SorzsSection";
import { UsersSection as UsersBackofficeSection } from "@/domain/UsersSection";

export function sectionContentOf(section: BackofficeSection): ReactNode {
	let content: ReactNode = null;
	if (section.is(new UsersBackofficeSection())) {
		content = <UsersSection />;
	}
	if (section.is(new SorzsBackofficeSection())) {
		content = <SorzsSection />;
	}
	return content;
}
