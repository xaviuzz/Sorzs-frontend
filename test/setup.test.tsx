import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

function Counter() {
	const [count, setCount] = useState(0);
	return (
		<button type="button" onClick={() => setCount(count + 1)}>
			clicks: {count}
		</button>
	);
}

describe("test environment", () => {
	test("renders React into the DOM and reacts to user events", async () => {
		render(<Counter />);

		await userEvent.click(screen.getByRole("button"));

		expect(screen.getByRole("button")).toHaveTextContent("clicks: 1");
	});
});
