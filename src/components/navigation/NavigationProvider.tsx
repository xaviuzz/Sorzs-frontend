import {
	createContext,
	type ReactNode,
	useContext,
	useSyncExternalStore,
} from "react";
import type { Navigation } from "@/domain/Navigation";

const NavigationContext = createContext<Navigation | null>(null);

export function NavigationProvider({
	navigation,
	children,
}: {
	navigation: Navigation;
	children: ReactNode;
}) {
	return (
		<NavigationContext.Provider value={navigation}>
			{children}
		</NavigationContext.Provider>
	);
}

function useNavigation(): Navigation {
	const navigation = useContext(NavigationContext);
	if (navigation === null) {
		throw new Error("navigation hooks need a NavigationProvider");
	}
	return navigation;
}

export function usePath(): string {
	const navigation = useNavigation();
	return useSyncExternalStore(navigation.subscribe, navigation.path);
}

export function useGo() {
	const navigation = useNavigation();
	return function go(path: string) {
		navigation.go(path);
	};
}

export function useReplace() {
	const navigation = useNavigation();
	return function replace(path: string) {
		navigation.replace(path);
	};
}
