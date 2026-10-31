import type { components } from "@/api/schema";

type ErrorBody = components["schemas"]["ErrorBody"];

export class CallRefusedError extends Error {
	readonly code: ErrorBody["code"];

	constructor(refusal: ErrorBody) {
		super(refusal.message);
		this.code = refusal.code;
	}
}
