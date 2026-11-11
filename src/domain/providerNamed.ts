import { GenericProvider } from "@/domain/GenericProvider";
import { RedditProvider } from "@/domain/RedditProvider";
import type { SearchProvider } from "@/domain/SearchProvider";

export function providerNamed(text: string): SearchProvider {
	let provider: SearchProvider = new GenericProvider();
	if (text === "reddit") {
		provider = new RedditProvider();
	}
	return provider;
}
