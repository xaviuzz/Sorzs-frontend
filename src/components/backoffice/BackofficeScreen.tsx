import { BackofficeSideBar } from "@/components/backoffice/BackofficeSideBar";
import { sectionContentOf } from "@/components/backoffice/sectionContentOf";
import { BackofficeHeader } from "@/components/header/BackofficeHeader";
import type { BackofficeSection } from "@/domain/BackofficeSection";

export function BackofficeScreen({ section }: { section: BackofficeSection }) {
	const content = sectionContentOf(section);

	return (
		<div className="flex min-h-screen flex-col">
			<BackofficeHeader />
			<div className="flex flex-1">
				<BackofficeSideBar active={section} />
				<main className="grid max-w-(--backoffice-content-width) flex-1 grid-cols-[1fr_auto] content-start items-center gap-y-4 p-4">
					<h2 className="text-xl">{section.title()}</h2>
					{content}
				</main>
			</div>
		</div>
	);
}
