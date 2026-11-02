import { NoToken } from "@/domain/NoToken";
import type { Token } from "@/domain/Token";
import type { TokenStore } from "@/domain/TokenStore";

type Listener = () => void;

export class Session {
	private current: Token;
	private readonly listeners = new Set<Listener>();

	constructor(private readonly store: TokenStore) {
		this.current = store.read();
	}

	enter(token: Token): void {
		this.store.save(token);
		this.change(token);
	}

	leave(): void {
		this.store.clear();
		this.change(new NoToken());
	}

	signed(request: Request): Request {
		return this.current.signed(request);
	}

	isOpen = (): boolean => {
		return this.current.isPresent();
	};

	subscribe = (listener: Listener): (() => void) => {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	};

	private change(token: Token): void {
		this.current = token;
		for (const listener of this.listeners) {
			listener();
		}
	}
}
