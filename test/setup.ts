import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

const matchers = await import("@testing-library/jest-dom/matchers");
const { cleanup } = await import("@testing-library/react");
const { afterEach, expect } = await import("bun:test");

expect.extend(matchers as never);
afterEach(cleanup);

const reportError = console.error;
console.error = (...details: unknown[]) => {
	const [template, tagName] = details;
	const isTagWarning = String(template).includes(
		"is unrecognized in this browser",
	);
	const isSearchTag = tagName === "search";
	if (isTagWarning && isSearchTag) return;
	reportError(...details);
};
