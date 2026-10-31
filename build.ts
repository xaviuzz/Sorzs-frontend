import tailwind from "bun-plugin-tailwind";

const result = await Bun.build({
	entrypoints: ["./index.html"],
	outdir: "./dist",
	plugins: [tailwind],
	minify: true,
});

if (!result.success) {
	console.error(result.logs.join("\n"));
	process.exit(1);
}
