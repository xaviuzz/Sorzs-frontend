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

export function useHealthCheck() {
	const api = useContext(ApiContext);
	if (api === null) {
		throw new Error("useHealthCheck needs an ApiProvider");
	}
	return api.healthCheck;
}
