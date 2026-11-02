type Listener = () => void;

export class Navigation {
	private readonly listeners = new Set<Listener>();

	constructor(private readonly browser: Window) {}

	path = (): string => {
		return this.browser.location.pathname;
	};

	go(path: string): void {
		this.browser.history.pushState(null, "", path);
		this.tell();
	}

	replace(path: string): void {
		this.browser.history.replaceState(null, "", path);
		this.tell();
	}

	subscribe = (listener: Listener): (() => void) => {
		this.listeners.add(listener);
		this.browser.addEventListener("popstate", listener);
		return () => {
			this.listeners.delete(listener);
			this.browser.removeEventListener("popstate", listener);
		};
	};

	private tell(): void {
		for (const listener of this.listeners) {
			listener();
		}
	}
}
