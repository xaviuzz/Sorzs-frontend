import type { ReactNode } from "react";

export function Brand({ children }: { children: ReactNode }) {
	return (
		<span className="font-script text-wordmark font-semibold">{children}</span>
	);
}
