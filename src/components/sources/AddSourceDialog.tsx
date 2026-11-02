import { type FormEvent, useRef, useState } from "react";
import { useAddSource, useInspectSource } from "@/api/ApiContext";
import type { PageInfo } from "@/api/InspectSource";
import { Brand } from "@/components/Brand";
import { AddSourceMessage } from "@/components/sources/AddSourceMessage";
import { AddSourceTrigger } from "@/components/sources/AddSourceTrigger";
import { CandidateList } from "@/components/sources/CandidateList";
import { InspectedFavicon } from "@/components/sources/InspectedFavicon";
import { messageOf } from "@/components/sources/messageOf";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AddressCandidate } from "@/domain/AddressCandidate";
import { NameDraft } from "@/domain/NameDraft";
import type { SourceEntry } from "@/domain/SourceEntry";

export function AddSourceDialog({
	onAdded,
}: {
	onAdded: (entry: SourceEntry) => void;
}) {
	const addSource = useAddSource();
	const inspectSource = useInspectSource();
	const [isOpen, setIsOpen] = useState(false);
	const [address, setAddress] = useState("");
	const [draft, setDraft] = useState(NameDraft.empty());
	const name = draft.text();
	const [inspected, setInspected] = useState<PageInfo | null>(null);
	const [isSending, setIsSending] = useState(false);
	const [message, setMessage] = useState("");
	const currentAddress = useRef("");

	async function submit(event: FormEvent) {
		event.preventDefault();
		setIsSending(true);
		setMessage("");
		try {
			const entry = await addSource.run(address, name);
			onAdded(entry);
			resetForm();
			setIsOpen(false);
		} catch (error) {
			setMessage(messageOf(error, "Source could not be added"));
		} finally {
			setIsSending(false);
		}
	}

	function resetForm() {
		writeAddress("");
		setDraft(NameDraft.empty());
		setInspected(null);
	}

	function writeAddress(value: string) {
		currentAddress.current = value;
		setAddress(value);
	}

	function typeAddress(event: FormEvent<HTMLInputElement>) {
		writeAddress(event.currentTarget.value);
		setInspected(null);
	}

	async function leaveAddress() {
		const inspectedAddress = address;
		if (inspectedAddress === "") return;
		try {
			const page = await inspectSource.run(inspectedAddress);
			if (currentAddress.current !== inspectedAddress) return;
			setInspected(page);
			setDraft(draft.suggest(page.title));
		} catch {
			return;
		}
	}

	function choose(candidate: AddressCandidate) {
		writeAddress(candidate.address);
		setDraft(draft.choose(candidate));
		if (inspected !== null) {
			setInspected({ ...inspected, favicon: candidate.favicon });
		}
	}

	function typeName(event: FormEvent<HTMLInputElement>) {
		setDraft(draft.type(event.currentTarget.value));
	}

	function showCandidates() {
		let shown = null;
		if (inspected !== null) {
			shown = (
				<CandidateList
					candidates={inspected.candidates}
					address={address}
					name={name}
					onChoose={choose}
				/>
			);
		}
		return shown;
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<AddSourceTrigger />
			<DialogContent>
				<form onSubmit={submit} className="flex flex-col gap-4">
					<DialogHeader>
						<DialogTitle>
							Add <Brand>Sorz</Brand>
						</DialogTitle>
						<DialogDescription className="sr-only">
							Register the URL of a site you trust and give it a title.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="source-address">URL</FieldLabel>
							<Input
								id="source-address"
								value={address}
								onChange={typeAddress}
								onBlur={leaveAddress}
							/>
							{showCandidates()}
						</Field>
						<Field>
							<FieldLabel htmlFor="source-name">Title</FieldLabel>
							<div className="flex items-center gap-2">
								<InspectedFavicon inspected={inspected} address={address} />
								<Input id="source-name" value={name} onChange={typeName} />
							</div>
						</Field>
					</FieldGroup>
					<AddSourceMessage message={message} />
					<DialogFooter>
						<Button type="submit" disabled={isSending}>
							Add
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
