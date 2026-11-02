import { type FormEvent, type SubmitEvent, useRef, useState } from "react";
import { useAddSource, useInspectSource } from "@/api/ApiContext";
import type { PageInfo } from "@/api/sources/InspectSource";
import { messageOf } from "@/components/sources/messageOf";
import type { AddressCandidate } from "@/domain/AddressCandidate";
import { NameDraft } from "@/domain/NameDraft";
import type { SourceEntry } from "@/domain/SourceEntry";

export function useAddSourceForm(onAdded: (entry: SourceEntry) => void) {
	const addSource = useAddSource();
	const inspectSource = useInspectSource();
	const [address, setAddress] = useState("");
	const [draft, setDraft] = useState(NameDraft.empty());
	const [inspected, setInspected] = useState<PageInfo | null>(null);
	const [isSending, setIsSending] = useState(false);
	const [message, setMessage] = useState("");
	const currentAddress = useRef("");

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		setIsSending(true);
		setMessage("");
		try {
			const entry = await addSource.run(address, draft.text());
			onAdded(entry);
		} catch (error) {
			setMessage(messageOf(error, "Source could not be added"));
		} finally {
			setIsSending(false);
		}
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
			setDraft((current) => current.suggest(page.title));
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

	return {
		address,
		name: draft.text(),
		inspected,
		isSending,
		message,
		submit,
		typeAddress,
		leaveAddress,
		choose,
		typeName,
	};
}
