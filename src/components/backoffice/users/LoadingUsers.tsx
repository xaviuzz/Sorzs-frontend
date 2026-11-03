import type { ReactNode } from "react";
import type { UsersReading } from "@/components/backoffice/users/UsersReading";

export class LoadingUsers implements UsersReading {
	append(): UsersReading {
		return this;
	}

	replace(): UsersReading {
		return this;
	}

	view(): ReactNode {
		return (
			<p role="status" className="col-span-2">
				Loading users
			</p>
		);
	}
}
