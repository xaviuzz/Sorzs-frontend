import { BearerToken } from "@/domain/BearerToken";
import { Session } from "@/domain/Session";
import { InMemoryTokenStore } from "./InMemoryTokenStore";

export function openSession(): Session {
	return new Session(new InMemoryTokenStore("t-0"));
}

export function closedSession(): Session {
	return new Session(new InMemoryTokenStore());
}

export function sessionWith(text: string): Session {
	const session = closedSession();
	session.enter(new BearerToken(text));
	return session;
}
