interface SectionTitleProps {
	children: string;
	prompt?: string;
}

export function SectionTitle({ children, prompt = "//" }: SectionTitleProps) {
	return (
		<div className="flex items-center gap-2">
			<span className="font-mono text-sm font-bold text-accent-green">
				{prompt}
			</span>
			<span className="font-mono text-sm font-bold text-text-primary">
				{children}
			</span>
		</div>
	);
}
