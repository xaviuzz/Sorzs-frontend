import { Brand } from "@/components/Brand";
import { BackofficeButton } from "@/components/header/BackofficeButton";
import { HealthMark } from "@/components/header/HealthMark";
import { LogoutButton } from "@/components/header/LogoutButton";
import { SearchBox } from "@/components/search/SearchBox";
import { useMayEnterBackoffice } from "@/components/session/SessionProvider";
import { AddSorzDialog } from "@/components/sorzs/add/AddSorzDialog";
import { useAppendSorz } from "@/components/sorzs/SorzsProvider";

export function Header() {
	const appendSorz = useAppendSorz();
	const mayEnterBackoffice = useMayEnterBackoffice();
	let backofficeButton = <></>;
	if (mayEnterBackoffice) {
		backofficeButton = <BackofficeButton />;
	}

	return (
		<header className="flex items-center gap-3 border-b px-4 py-6">
			<h1 className="text-5xl">
				<Brand>Sorzs</Brand>
			</h1>
			<HealthMark />
			<div className="mx-auto w-full max-w-2xl">
				<SearchBox />
			</div>
			<div className="flex items-center gap-2">
				<AddSorzDialog onAdded={appendSorz} />
				{backofficeButton}
				<LogoutButton />
			</div>
		</header>
	);
}
