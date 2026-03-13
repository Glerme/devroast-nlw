type Severity = "critical" | "warning" | "good";

interface IssueCardProps {
	severity: Severity;
	title: string;
	description: string;
}

const severityStyles: Record<Severity, { dot: string; label: string }> = {
	critical: {
		dot: "bg-accent-red",
		label: "text-accent-red",
	},
	warning: {
		dot: "bg-accent-amber",
		label: "text-accent-amber",
	},
	good: {
		dot: "bg-accent-green",
		label: "text-accent-green",
	},
};

export function IssueCard({ severity, title, description }: IssueCardProps) {
	const styles = severityStyles[severity];

	return (
		<div className="flex flex-1 flex-col gap-3 border border-border-primary p-5">
			<div className="flex items-center gap-2">
				<span className={`h-2 w-2 rounded-full ${styles.dot}`} />
				<span className={`font-mono text-xs font-medium ${styles.label}`}>
					{severity}
				</span>
			</div>
			<span className="font-mono text-[13px] font-medium text-text-primary">
				{title}
			</span>
			<p className="font-body text-xs leading-6 text-text-secondary">
				{description}
			</p>
		</div>
	);
}
