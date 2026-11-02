export class CallId {
	private constructor(private readonly value: string) {}

	static next(): CallId {
		return new CallId(crypto.randomUUID());
	}

	header(): { callId: string } {
		return { callId: this.value };
	}
}
