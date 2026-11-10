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
		"/sorzs.add": proxyTo("/sorzs.add"),
		"/sorzs.inspect": proxyTo("/sorzs.inspect"),
		"/sorzs.list": proxyTo("/sorzs.list"),
		"/sorzs.search": proxyTo("/sorzs.search"),
		"/sorzs.census": proxyTo("/sorzs.census"),
		"/users.add": proxyTo("/users.add"),
		"/users.list": proxyTo("/users.list"),
		"/users.setRole": proxyTo("/users.setRole"),
	},
	development: true,
});
