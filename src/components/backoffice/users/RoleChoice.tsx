import {
	Field,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { AdminRole } from "@/domain/AdminRole";
import type { Role } from "@/domain/Role";
import { UserRole } from "@/domain/UserRole";

const CHOICES: Role[] = [new UserRole(), new AdminRole()];

export function RoleChoice({
	chosen,
	onChoose,
}: {
	chosen: Role;
	onChoose: (role: Role) => void;
}) {
	return (
		<FieldSet>
			<FieldLegend
				variant="label"
				className="float-left mr-3 mb-0 w-(--field-label-width) leading-5"
			>
				Role
			</FieldLegend>
			<div className="flex gap-6">
				{CHOICES.map((choice) => (
					<Field
						key={choice.text()}
						orientation="horizontal"
						className="w-auto"
					>
						<input
							type="radio"
							name="user-role"
							id={`user-role-${choice.text()}`}
							checked={chosen.text() === choice.text()}
							onChange={() => onChoose(choice)}
						/>
						<FieldLabel htmlFor={`user-role-${choice.text()}`}>
							{choice.text()}
						</FieldLabel>
					</Field>
				))}
			</div>
		</FieldSet>
	);
}
