import { type FormEvent, useState } from "react";
import { useAddSource } from "@/api/ApiContext";
import { messageOf } from "@/components/messageOf";
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

export function AddSourceDialog({
	onAdded,
}: {
	onAdded: (entry: SourceEntry) => void;
}) {
	const addSource = useAddSource();
	const [isOpen, setIsOpen] = useState(false);
	const [address, setAddress] = useState("");
	const [name, setName] = useState("");
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
			setIsOpen(false);
		} catch (error) {
			setMessage(messageOf(error, "Source could not be added"));
		} finally {
			setIsSending(false);
		}
	}

	function typeAddress(event: FormEvent<HTMLInputElement>) {
		setAddress(event.currentTarget.value);
	}

	function typeName(event: FormEvent<HTMLInputElement>) {
		setName(event.currentTarget.value);
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
				<Button>Add Sorz</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={submit} className="flex flex-col gap-4">
					<DialogHeader>
						<DialogTitle>Add Sorz</DialogTitle>
						<DialogDescription>
							Register a web address you trust and give it a name.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="source-address">Address</FieldLabel>
							<Input
								id="source-address"
								value={address}
								onChange={typeAddress}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="source-name">Name</FieldLabel>
							<Input id="source-name" value={name} onChange={typeName} />
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
