import { AdminRole } from "@/domain/AdminRole";
import { BearerToken } from "@/domain/BearerToken";
import { Navigation } from "@/domain/Navigation";
import { Session } from "@/domain/Session";
import { InMemoryTokenStore } from "./InMemoryTokenStore";

export function openSession(): Session {
	return new Session(new InMemoryTokenStore("t-0"));
}

export function adminSession(): Session {
	const session = closedSession();
	session.enter(new BearerToken("t-0", new AdminRole()));
	return session;
}

export function closedSession(): Session {
	return new Session(new InMemoryTokenStore());
}

export function sessionWith(text: string): Session {
	const session = closedSession();
	session.enter(new BearerToken(text));
	return session;
}

export function navigationAt(path: string): Navigation {
	window.happyDOM.setURL(`http://localhost${path}`);
	return new Navigation(window);
}
