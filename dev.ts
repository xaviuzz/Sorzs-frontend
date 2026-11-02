import index from "./index.html";

const apiUrl = process.env.API_URL ?? "http://localhost:3000";

function proxyTo(path: string) {
	return (request: Request) => fetch(new URL(path, apiUrl), request);
}

Bun.serve({
	port: Number(process.env.PORT ?? 5173),
	routes: {
		"/*": index,
		"/auth.login": proxyTo("/auth.login"),
		"/health.check": proxyTo("/health.check"),
		"/sources.add": proxyTo("/sources.add"),
		"/sources.inspect": proxyTo("/sources.inspect"),
		"/sources.list": proxyTo("/sources.list"),
		"/sources.search": proxyTo("/sources.search"),
	},
	development: true,
});
