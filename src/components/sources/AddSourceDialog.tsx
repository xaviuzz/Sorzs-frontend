import { type FormEvent, useState } from "react";
import { useAddSource, useInspectSource } from "@/api/ApiContext";
import type { PageInfo } from "@/api/InspectSource";
import { Brand } from "@/components/Brand";
import { messageOf } from "@/components/sources/messageOf";
import { SourceFavicon } from "@/components/sources/SourceFavicon";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { SourceEntry } from "@/domain/SourceEntry";
import { SuggestedName } from "@/domain/SuggestedName";

export function AddSourceDialog({
	onAdded,
}: {
	onAdded: (entry: SourceEntry) => void;
}) {
	const addSource = useAddSource();
	const inspectSource = useInspectSource();
	const [isOpen, setIsOpen] = useState(false);
	const [address, setAddress] = useState("");
	const [name, setName] = useState("");
	const [suggestedName, setSuggestedName] = useState("");
	const [inspected, setInspected] = useState<PageInfo | null>(null);
	const [isSending, setIsSending] = useState(false);
	const [message, setMessage] = useState("");

	async function submit(event: FormEvent) {
		event.preventDefault();
		setIsSending(true);
		setMessage("");
		try {
			const entry = await addSource.run(address, name);
			onAdded(entry);
			setAddress("");
			setName("");
			setSuggestedName("");
			setInspected(null);
			setIsOpen(false);
		} catch (error) {
			setMessage(messageOf(error, "Source could not be added"));
		} finally {
			setIsSending(false);
		}
	}

	function typeAddress(event: FormEvent<HTMLInputElement>) {
		setAddress(event.currentTarget.value);
		setInspected(null);
	}

	async function leaveAddress() {
		if (address === "") return;
		try {
			const page = await inspectSource.run(address);
			setInspected(page);
			suggest(page.title);
		} catch {
			return;
		}
	}

	function suggest(title: string | null) {
		const isNameFree = name === "" || name === suggestedName;
		if (title === null || !isNameFree) return;
		const suggestion = SuggestedName.from(title).text();
		setName(suggestion);
		setSuggestedName(suggestion);
	}

	function typeName(event: FormEvent<HTMLInputElement>) {
		setName(event.currentTarget.value);
	}

	function showFavicon() {
		let shown = null;
		if (inspected !== null) {
			shown = <SourceFavicon favicon={inspected.favicon} text={address} />;
		}
		return shown;
	}

	function showMessage() {
		let shown = null;
		if (message !== "") {
			shown = (
				<p role="alert" className="text-error">
					{message}
				</p>
			);
		}
		return shown;
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button aria-label="Add Sorz" size="icon-sm">
					<span aria-hidden="true">
						<span className="text-base">
							<Brand>S</Brand>
						</span>
						+
					</span>
				</Button>
			</DialogTrigger>
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
						</Field>
						<Field>
							<FieldLabel htmlFor="source-name">Title</FieldLabel>
							<div className="flex items-center gap-2">
								{showFavicon()}
								<Input id="source-name" value={name} onChange={typeName} />
							</div>
						</Field>
					</FieldGroup>
					{showMessage()}
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
