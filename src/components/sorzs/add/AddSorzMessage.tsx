export function AddSorzMessage({ message }: { message: string }) {
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
