import type { ReactNode } from "react";
import type { UserEntry } from "@/domain/UserEntry";

export interface UsersReading {
	view(): ReactNode;
	append(entry: UserEntry): UsersReading;
	replace(entry: UserEntry): UsersReading;
}
