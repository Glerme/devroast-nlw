interface DiffLine {
	type: "context" | "added" | "removed";
	content: string;
}

interface DiffBlockProps {
	fileName: string;
	lines: DiffLine[];
}

const lineStyles: Record<
	DiffLine["type"],
	{ bg: string; prefix: string; text: string }
> = {
	context: {
		bg: "",
		prefix: "  ",
		text: "text-text-primary",
	},
	removed: {
		bg: "bg-diff-removed",
		prefix: "- ",
		text: "text-accent-red",
	},
	added: {
		bg: "bg-diff-added",
		prefix: "+ ",
		text: "text-accent-green",
	},
};

export function DiffBlock({ fileName, lines }: DiffBlockProps) {
	return (
		<div className="overflow-hidden border border-border-primary bg-bg-input">
			<div className="flex h-10 items-center gap-2 border-b border-border-primary px-4">
				<span className="font-mono text-xs font-medium text-text-secondary">
					{fileName}
				</span>
			</div>
			<div className="flex flex-col py-1">
				{lines.map((line, i) => {
					const style = lineStyles[line.type];
					return (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: diff lines are positional
							key={i}
							className={`flex h-7 items-center px-4 ${style.bg}`}
						>
							<span
								className={`w-5 shrink-0 font-mono text-xs ${
									line.type === "context" ? "text-text-tertiary" : style.text
								}`}
							>
								{style.prefix}
							</span>
							<span className={`font-mono text-xs ${style.text}`}>
								{line.content}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
