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
			<FieldLegend variant="label">Role</FieldLegend>
			{CHOICES.map((choice) => (
				<Field key={choice.text()} orientation="horizontal">
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
		</FieldSet>
	);
}
