import { createRoot } from "react-dom/client";
import { App } from "@/App";
import { ApiProvider } from "@/api/ApiContext";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement === null) {
	throw new Error("#root not found");
}

createRoot(rootElement).render(
	<ApiProvider baseUrl={window.location.origin}>
		<App />
	</ApiProvider>,
);
