import createClient, { type ClientOptions } from "openapi-fetch";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { Api } from "@/api/Api";
import { SessionMiddleware } from "@/api/SessionMiddleware";
import type { paths } from "@/api/schema";
import type { Session } from "@/domain/Session";

const ApiContext = createContext<Api | null>(null);

export function ApiProvider({
	baseUrl,
	fetch,
	session,
	children,
}: {
	baseUrl: string;
	fetch?: ClientOptions["fetch"];
	session: Session;
	children: ReactNode;
}) {
	const api = useMemo(() => {
		const client = createClient<paths>({ baseUrl, fetch });
		client.use(new SessionMiddleware(session));
		return new Api(client);
	}, [baseUrl, fetch, session]);

	return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

function useApi(hookName: string) {
	const api = useContext(ApiContext);
	if (api === null) {
		throw new Error(`${hookName} needs an ApiProvider`);
	}
	return api;
}

export function useHealthCheck() {
	const api = useApi("useHealthCheck");
	return api.healthCheck;
}

export function useLogin() {
	const api = useApi("useLogin");
	return api.login;
}

export function useListSources() {
	const api = useApi("useListSources");
	return api.listSources;
}

export function useAddSource() {
	const api = useApi("useAddSource");
	return api.addSource;
}

export function useSearchSources() {
	const api = useApi("useSearchSources");
	return api.searchSources;
}

export function useInspectSource() {
	const api = useApi("useInspectSource");
	return api.inspectSource;
}

export function useListUsers() {
	const api = useApi("useListUsers");
	return api.listUsers;
}

export function useAddUser() {
	const api = useApi("useAddUser");
	return api.addUser;
}

export function useSetRole() {
	const api = useApi("useSetRole");
	return api.setRole;
}
