"use client";

import { useState } from "react";

interface ToggleProps {
	label?: string;
	hint?: string;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
}

export function Toggle({
	label,
	hint,
	defaultChecked = false,
	onChange,
}: ToggleProps) {
	const [checked, setChecked] = useState(defaultChecked);

	function handleToggle() {
		const next = !checked;
		setChecked(next);
		onChange?.(next);
	}

	return (
		<div className="flex items-center gap-4">
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				onClick={handleToggle}
				className={`relative h-[22px] w-10 rounded-full transition-colors ${
					checked ? "bg-accent-green" : "bg-border-primary"
				}`}
			>
				<span
					className={`absolute top-[3px] block h-4 w-4 rounded-full bg-bg-page transition-[left] ${
						checked ? "left-[21px]" : "left-[3px]"
					}`}
				/>
			</button>
			{label && (
				<span
					className={`font-mono text-[13px] ${
						checked ? "text-accent-green" : "text-text-secondary"
					}`}
				>
					{label}
				</span>
			)}
			{hint && (
				<span className="font-body text-xs text-text-tertiary">{hint}</span>
			)}
		</div>
	);
}
