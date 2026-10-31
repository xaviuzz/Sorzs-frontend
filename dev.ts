import index from "./index.html";

const apiUrl = process.env.API_URL ?? "http://localhost:3000";

function proxyTo(path: string) {
	return (request: Request) => fetch(new URL(path, apiUrl), request);
}

Bun.serve({
	port: Number(process.env.PORT ?? 5173),
	routes: {
		"/*": index,
		"/health.check": proxyTo("/health.check"),
	},
	development: true,
});
