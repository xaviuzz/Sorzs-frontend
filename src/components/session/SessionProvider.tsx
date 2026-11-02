import {
	createContext,
	type ReactNode,
	useContext,
	useSyncExternalStore,
} from "react";
import { LoginScreen } from "@/components/session/LoginScreen";
import type { Session } from "@/domain/Session";
import type { Token } from "@/domain/Token";

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
	session,
	children,
}: {
	session: Session;
	children: ReactNode;
}) {
	const isOpen = useSyncExternalStore(session.subscribe, session.isOpen);

	let shown: ReactNode = <LoginScreen />;
	if (isOpen) {
		shown = children;
	}

	return (
		<SessionContext.Provider value={session}>{shown}</SessionContext.Provider>
	);
}

export function useEnterSession() {
	const session = useContext(SessionContext);
	if (session === null) {
		throw new Error("useEnterSession needs a SessionProvider");
	}
	return function enter(token: Token) {
		session.enter(token);
	};
}

export function useLeaveSession() {
	const session = useContext(SessionContext);
	if (session === null) {
		throw new Error("useLeaveSession needs a SessionProvider");
	}
	return function leave() {
		session.leave();
	};
}

export function useMayEnterBackoffice(): boolean {
	const session = useContext(SessionContext);
	if (session === null) {
		throw new Error("useMayEnterBackoffice needs a SessionProvider");
	}
	return useSyncExternalStore(session.subscribe, session.mayEnterBackoffice);
}
