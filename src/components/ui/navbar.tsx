import type { ReactNode } from "react";

interface NavbarProps {
	rightSlot?: ReactNode;
}

export function Navbar({ rightSlot }: NavbarProps) {
	return (
		<nav className="flex h-14 w-full items-center justify-between border-b border-border-primary px-10">
			<div className="flex items-center gap-2">
				<span className="font-mono text-xl font-bold text-accent-green">
					{">"}
				</span>
				<span className="font-mono text-lg font-medium text-text-primary">
					devroast
				</span>
			</div>
			{rightSlot && <div className="flex items-center gap-6">{rightSlot}</div>}
		</nav>
	);
}
