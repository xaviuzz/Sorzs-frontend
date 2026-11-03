import type { ReactNode } from "react";
import { Field } from "@/components/ui/field";

export function SideLabelField({ children }: { children: ReactNode }) {
	return (
		<Field className="grid grid-cols-[var(--field-label-width)_1fr] items-center gap-x-3 gap-y-2 [&>:not(label)]:col-start-2">
			{children}
		</Field>
	);
}
