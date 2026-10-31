import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

const committedPath = "src/api/schema.d.ts";
const scratchDirectory = await mkdtemp(join(tmpdir(), "sorzs-generate-"));
const freshPath = join(scratchDirectory, "schema.d.ts");

await $`openapi-typescript openapi.yaml -o ${freshPath}`.quiet();
const committed = await readFile(committedPath, "utf8");
const fresh = await readFile(freshPath, "utf8");
await rm(scratchDirectory, { recursive: true });

if (committed !== fresh) {
	console.error(
		`${committedPath} drifted from openapi.yaml; run bun run generate`,
	);
	process.exit(1);
}
