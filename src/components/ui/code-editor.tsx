"use client";

interface CodeEditorProps {
	value?: string;
	onChange?: (value: string) => void;
	lineCount?: number;
	className?: string;
}

export function CodeEditor({
	value = "",
	onChange,
	lineCount,
	className = "",
}: CodeEditorProps) {
	const lines = value.split("\n");
	const count = lineCount ?? Math.max(lines.length, 16);

	return (
		<div
			className={`overflow-hidden border border-border-primary bg-bg-input ${className}`}
		>
			<div className="flex h-10 items-center border-b border-border-primary px-4">
				<div className="flex items-center gap-2">
					<span className="h-3 w-3 rounded-full bg-dot-close" />
					<span className="h-3 w-3 rounded-full bg-dot-minimize" />
					<span className="h-3 w-3 rounded-full bg-dot-maximize" />
				</div>
			</div>
			<div className="flex">
				<div className="flex w-12 shrink-0 flex-col items-end gap-2 border-r border-border-primary bg-bg-surface px-3 py-4">
					{Array.from({ length: count }, (_, i) => (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: static line numbers
							key={i}
							className="font-mono text-xs leading-5 text-text-tertiary"
						>
							{i + 1}
						</span>
					))}
				</div>
				<textarea
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					spellCheck={false}
					className="flex-1 resize-none bg-transparent p-4 font-mono text-xs leading-5 text-text-primary outline-none placeholder:text-text-tertiary"
					placeholder="// paste your code here..."
					rows={count}
				/>
			</div>
		</div>
	);
}
