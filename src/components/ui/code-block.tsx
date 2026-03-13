import { codeToHtml } from "shiki";

interface CodeBlockProps {
	code: string;
	lang?: string;
	className?: string;
}

export async function CodeBlock({
	code,
	lang = "javascript",
	className = "",
}: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang,
		theme: "vesper",
	});

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
			<div
				className="code-block-content [&_pre]:overflow-auto [&_pre]:p-4 [&_pre]:!bg-transparent [&_pre]:font-mono [&_pre]:text-xs [&_pre]:leading-5 [&_code]:font-mono [&_.line]:min-h-5"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted HTML from Shiki server-side
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
