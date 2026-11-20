import type { CensusEntryData } from "@/domain/CensusEntry";
import type { SorzEntryData } from "@/domain/SorzEntry";

const NAMES: Record<string, string> = {
	reddit: "Reddit",
	wikipedia: "Wikipedia",
	geekfeminism: "Geek Feminism",
	appropedia: "Appropedia",
	generic: "Generic",
};

type Named = { provider: string; providerName: string };

function nameOf(provider: string): string {
	return NAMES[provider] ?? provider;
}

export function sorzEntryData(
	parts: Partial<SorzEntryData & Named> = {},
): SorzEntryData & Named {
	const provider = parts.provider ?? "generic";
	return {
		sorzId: "s-1",
		name: "Alpha",
		address: "https://a.com",
		title: null,
		favicon: null,
		provider,
		providerName: nameOf(provider),
		...parts,
	};
}

export function censusEntryData(
	parts: Partial<CensusEntryData & Named> = {},
): CensusEntryData & Named {
	const provider = parts.provider ?? "generic";
	return {
		address: "https://a.com",
		favicon: null,
		provider,
		providerName: nameOf(provider),
		users: 1,
		...parts,
	};
}
