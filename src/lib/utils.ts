import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	const joined = clsx(inputs);
	const merged = twMerge(joined);
	return merged;
}
