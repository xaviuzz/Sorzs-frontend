import type { ReactNode } from "react";

export function Brand({ children }: { children: ReactNode }) {
	return (
		<span className="font-script text-[1.25em] font-semibold">{children}</span>
	);
}
