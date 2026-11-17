import { GenericProvider } from "@/domain/GenericProvider";
import { RedditProvider } from "@/domain/RedditProvider";
import type { SearchProvider } from "@/domain/SearchProvider";
import { WikipediaProvider } from "@/domain/WikipediaProvider";

export function providerNamed(text: string): SearchProvider {
	let provider: SearchProvider = new GenericProvider();
	if (text === "reddit") {
		provider = new RedditProvider();
	}
	if (text === "wikipedia") {
		provider = new WikipediaProvider();
	}
	return provider;
}
