import Link from "next/link";
import { codeToHtml } from "shiki";

interface LeaderboardEntryProps {
	rank: number;
	score: number;
	language: string;
	code: string;
	codeLines: number;
	id?: string;
}

export async function LeaderboardEntry({
	rank,
	score,
	language,
	code,
	codeLines,
	id,
}: LeaderboardEntryProps) {
	const html = await codeToHtml(code, {
		lang: language,
		theme: "vesper",
	});

	const lines = code.split("\n");
	const href = id ? `/roast/${id}` : `/roast/${rank}`;

	return (
		<Link
			href={href}
			className="block border border-border-primary transition-colors hover:border-accent-green/40"
		>
			<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
				<div className="flex items-center gap-4">
					<span className="font-mono text-[13px] font-bold">
						<span className="text-text-tertiary">#</span>
						<span className="text-accent-amber">{rank}</span>
					</span>
					<span className="flex items-center gap-1.5">
						<span className="font-body text-xs text-text-tertiary">
							score:
						</span>
						<span className="font-mono text-[13px] font-bold text-accent-red">
							{score.toFixed(1)}
						</span>
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="font-body text-xs text-text-secondary">
						{language}
					</span>
					<span className="font-body text-xs text-text-tertiary">
						{codeLines} {codeLines === 1 ? "line" : "lines"}
					</span>
				</div>
			</div>
			<div className="max-h-[120px] overflow-hidden bg-bg-input">
				<div className="flex">
					<div className="flex w-10 shrink-0 flex-col bg-bg-surface pt-4 text-right font-mono text-xs leading-5 text-text-tertiary">
						{lines.map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: positional line numbers
							<span key={i} className="pr-2">
								{i + 1}
							</span>
						))}
					</div>
					<div
						className="min-w-0 flex-1 [&_pre]:overflow-hidden [&_pre]:p-4 [&_pre]:!bg-transparent [&_pre]:font-mono [&_pre]:text-xs [&_pre]:leading-5 [&_code]:font-mono [&_.line]:min-h-5"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted HTML from Shiki server-side
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</div>
			</div>
		</Link>
	);
}
