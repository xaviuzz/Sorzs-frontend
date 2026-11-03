import type { ReactNode } from "react";
import { UserRow } from "@/components/backoffice/users/UserRow";
import type { UsersReading } from "@/components/backoffice/users/UsersReading";
import { UsersToolbar } from "@/components/backoffice/users/UsersToolbar";
import type { UserEntry } from "@/domain/UserEntry";

export class LoadedUsers implements UsersReading {
	constructor(private readonly entries: UserEntry[]) {}

	append(entry: UserEntry): UsersReading {
		return new LoadedUsers([...this.entries, entry]);
	}

	replace(entry: UserEntry): UsersReading {
		const replaced: UserEntry[] = [];
		for (const each of this.entries) {
			if (each.username === entry.username) {
				replaced.push(entry);
			} else {
				replaced.push(each);
			}
		}
		return new LoadedUsers(replaced);
	}

	view(): ReactNode {
		return (
			<>
				<UsersToolbar />
				<ul className="col-span-2 flex flex-col">
					{this.entries.map((entry) => (
						<UserRow key={entry.username} entry={entry} />
					))}
				</ul>
			</>
		);
	}
}
