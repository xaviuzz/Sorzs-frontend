import type { Session } from "@/domain/Session";

const FORBIDDEN = 403;

export class SessionMiddleware {
	constructor(private readonly session: Session) {}

	onRequest = ({ request }: { request: Request }): Request => {
		return this.session.signed(request);
	};

	onResponse = ({ response }: { response: Response }): undefined => {
		if (response.status === FORBIDDEN) this.session.forget();
		return undefined;
	};
}
