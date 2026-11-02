import { beforeEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Brand } from "@/components/Brand";

describe("Brand", () => {
	let sut: SUT;

	beforeEach(() => {
		sut = new SUT();
	});

	test("shows the name in the brand font", () => {
		sut.show("Sorzs");

		expect(sut.name("Sorzs")).toHaveClass("font-script");
	});

	test("compensates the size and weight the brand font lacks", () => {
		sut.show("Sorzs");

		expect(sut.name("Sorzs")).toHaveClass("text-wordmark", "font-semibold");
	});
});

class SUT {
	show(name: string) {
		render(<Brand>{name}</Brand>);
	}

	name(text: string) {
		return screen.getByText(text);
	}
}
