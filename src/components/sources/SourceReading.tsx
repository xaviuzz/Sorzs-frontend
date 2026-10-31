import type { ReactNode } from "react";
import { messageOf } from "@/components/sources/messageOf";
import type { SourceEntry } from "@/domain/SourceEntry";

export interface SourceReading {
	view(): ReactNode;
	append(entry: SourceEntry): SourceReading;
}

export class LoadingSources implements SourceReading {
	append(): SourceReading {
		return this;
	}

	view(): ReactNode {
		return <p role="status">Loading sources</p>;
	}
}

export class LoadedSources implements SourceReading {
	constructor(private readonly entries: SourceEntry[]) {}

	append(entry: SourceEntry): SourceReading {
		return new LoadedSources([...this.entries, entry]);
	}

	view(): ReactNode {
		let view: ReactNode = (
			<p className="text-muted-foreground">You have no sources yet</p>
		);
		if (this.entries.length > 0) {
			view = (
				<ul className="flex flex-col gap-1">
					{this.entries.map((entry) => (
						<li key={entry.sourceId} title={entry.address}>
							{entry.name}
						</li>
					))}
				</ul>
			);
		}
		return view;
	}
}

export class FailedSources implements SourceReading {
	constructor(private readonly message: string) {}

	static from(error: unknown): FailedSources {
		const message = messageOf(error, "Sources could not be loaded");
		return new FailedSources(message);
	}

	append(): SourceReading {
		return this;
	}

	view(): ReactNode {
		return (
			<p role="alert" className="text-error">
				{this.message}
			</p>
		);
	}
}
