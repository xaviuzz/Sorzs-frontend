import { Check, Circle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useHealthCheck } from "@/api/ApiContext";
import type { Health } from "@/api/HealthCheck";

type Reading = Health | "checking";

const marks = {
	checking: {
		Icon: Circle,
		label: "Checking service",
		color: "text-muted-foreground",
	},
	ok: { Icon: Check, label: "Service is up", color: "text-ok" },
	error: { Icon: X, label: "Service is down", color: "text-error" },
};

export function HealthMark() {
	const healthCheck = useHealthCheck();
	const [reading, setReading] = useState<Reading>("checking");

	useEffect(() => {
		let isCurrent = true;
		healthCheck.run().then((health) => {
			if (isCurrent) {
				setReading(health);
			}
		});
		return () => {
			isCurrent = false;
		};
	}, [healthCheck]);

	const { Icon, label, color } = marks[reading];
	return <Icon role="status" aria-label={label} className={color} />;
}
