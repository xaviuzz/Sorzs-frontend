import { createRoot } from "react-dom/client";
import { App } from "@/App";
import { ApiProvider } from "@/api/ApiContext";
import { LocalStorageTokenStore } from "@/components/session/LocalStorageTokenStore";
import { SessionProvider } from "@/components/session/SessionProvider";
import { Session } from "@/domain/Session";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement === null) {
	throw new Error("#root not found");
}

const session = new Session(new LocalStorageTokenStore(window.localStorage));

createRoot(rootElement).render(
	<ApiProvider baseUrl={window.location.origin} session={session}>
		<SessionProvider session={session}>
			<App />
		</SessionProvider>
	</ApiProvider>,
);
