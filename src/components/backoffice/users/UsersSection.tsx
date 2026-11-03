import {
	UsersProvider,
	useUsers,
} from "@/components/backoffice/users/UsersProvider";

function UsersReadingView() {
	const users = useUsers();
	return users.reading.view();
}

export function UsersSection() {
	return (
		<UsersProvider>
			<UsersReadingView />
		</UsersProvider>
	);
}
