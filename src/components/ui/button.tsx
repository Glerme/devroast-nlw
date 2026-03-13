import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary: "bg-accent-green text-bg-page hover:bg-accent-green/90",
	outline:
		"border border-border-primary text-text-primary hover:border-accent-green/50",
};

export function Button({
	variant = "primary",
	className = "",
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={`inline-flex items-center gap-2 px-6 py-2.5 font-mono text-[13px] font-medium transition-colors ${variantStyles[variant]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
