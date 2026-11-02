import { CallRefusedError } from "@/api/CallRefusedError";
import type { components } from "@/api/schema";

type ErrorBody = components["schemas"]["ErrorBody"];

type Answer<Body> =
	| { data: { body: Body }; error?: undefined }
	| { data?: undefined; error: ErrorBody };

export class Refusable<Body> {
	private constructor(private readonly answer: Answer<Body>) {}

	static of<Body>(answer: Answer<Body>): Refusable<Body> {
		return new Refusable(answer);
	}

	success(): Exclude<Body, ErrorBody> {
		if (this.answer.error) throw new CallRefusedError(this.answer.error);
		const body = this.answer.data.body;
		if (this.isRefusal(body)) throw new CallRefusedError(body);
		return body as Exclude<Body, ErrorBody>;
	}

	private isRefusal(body: Body): body is Body & ErrorBody {
		return typeof body === "object" && body !== null && "code" in body;
	}
}
