import createClient, { type ClientOptions } from "openapi-fetch";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { Api } from "@/api/Api";
import type { paths } from "@/api/schema";

const ApiContext = createContext<Api | null>(null);

export function ApiProvider({
	baseUrl,
	fetch,
	children,
}: {
	baseUrl: string;
	fetch?: ClientOptions["fetch"];
	children: ReactNode;
}) {
	const api = useMemo(() => {
		const client = createClient<paths>({ baseUrl, fetch });
		return new Api(client);
	}, [baseUrl, fetch]);

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
