import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

const matchers = await import("@testing-library/jest-dom/matchers");
const { cleanup } = await import("@testing-library/react");
const { afterEach, expect } = await import("bun:test");

expect.extend(matchers as never);
afterEach(cleanup);
