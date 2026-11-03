import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useAddUser, useListUsers, useSetRole } from "@/api/ApiContext";
import { FailedUsers } from "@/components/backoffice/users/FailedUsers";
import { LoadedUsers } from "@/components/backoffice/users/LoadedUsers";
import { LoadingUsers } from "@/components/backoffice/users/LoadingUsers";
import type { UsersReading } from "@/components/backoffice/users/UsersReading";
import type { Role } from "@/domain/Role";

interface Users {
	reading: UsersReading;
	add: (username: string, password: string, role: Role) => Promise<void>;
	setRole: (username: string, role: Role) => Promise<void>;
}

const UsersContext = createContext<Users | null>(null);

export function UsersProvider({ children }: { children: ReactNode }) {
	const listUsers = useListUsers();
	const addUser = useAddUser();
	const setUserRole = useSetRole();
	const [reading, setReading] = useState<UsersReading>(new LoadingUsers());

	useEffect(() => {
		let isCurrent = true;
		listUsers
			.run()
			.then((entries) => new LoadedUsers(entries))
			.catch((error) => FailedUsers.from(error))
			.then((loaded) => {
				if (isCurrent) {
					setReading(loaded);
				}
			});
		return () => {
			isCurrent = false;
		};
	}, [listUsers]);

	const users = useMemo(() => {
		async function add(username: string, password: string, role: Role) {
			const entry = await addUser.run(username, password, role);
			setReading((current) => current.append(entry));
		}
		async function setRole(username: string, role: Role) {
			const entry = await setUserRole.run(username, role);
			setReading((current) => current.replace(entry));
		}
		return { reading, add, setRole };
	}, [reading, addUser, setUserRole]);

	return (
		<UsersContext.Provider value={users}>{children}</UsersContext.Provider>
	);
}

export function useUsers() {
	const users = useContext(UsersContext);
	if (users === null) {
		throw new Error("useUsers needs a UsersProvider");
	}
	return users;
}
