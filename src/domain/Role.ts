export interface Role {
	text(): string;
	mayEnterBackoffice(): boolean;
	opposite(): Role;
	changeLabel(): string;
}
