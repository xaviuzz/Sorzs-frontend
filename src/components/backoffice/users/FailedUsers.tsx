import type { ReactNode } from "react";
import type { UsersReading } from "@/components/backoffice/users/UsersReading";
import { messageOf } from "@/components/messageOf";

export class FailedUsers implements UsersReading {
	constructor(private readonly message: string) {}

	static from(error: unknown): FailedUsers {
		const message = messageOf(error, "Users could not be loaded");
		return new FailedUsers(message);
	}

	append(): UsersReading {
		return this;
	}

	replace(): UsersReading {
		return this;
	}

	view(): ReactNode {
		return (
			<p role="alert" className="col-span-2 text-error">
				{this.message}
			</p>
		);
	}
}
