import { useEffect } from "react";
import { BackofficeScreen } from "@/components/backoffice/BackofficeScreen";
import {
	usePath,
	useReplace,
} from "@/components/navigation/NavigationProvider";
import { SorzsScreen } from "@/components/SorzsScreen";
import { useMayEnterBackoffice } from "@/components/session/SessionProvider";
import type { BackofficeSection } from "@/domain/BackofficeSection";
import { placeAt } from "@/domain/placeAt";

function showSorzs() {
	return <SorzsScreen />;
}

function showBackoffice(section: BackofficeSection) {
	return <BackofficeScreen section={section} />;
}

export function App() {
	const path = usePath();
	const replace = useReplace();
	const mayEnterBackoffice = useMayEnterBackoffice();
	const place = placeAt(path, mayEnterBackoffice);
	const placePath = place.path();

	useEffect(() => {
		if (placePath !== path) {
			replace(placePath);
		}
	}, [path, placePath, replace]);

	return place.choose({ sorzs: showSorzs, backoffice: showBackoffice });
}
