import Link from "next/link";
import { Suspense } from "react";
import { Button, SectionTitle } from "@/components/ui";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { CodeInputSection } from "./code-input-section";
import { HomeMetrics, HomeMetricsSkeleton } from "./home-metrics";

const leaderboardRows = [
	{
		rank: 1,
		id: "1",
		score: "1.2",
		code: [
			'eval(prompt("enter code"))',
			"document.write(response)",
			"// trust the user lol",
		],
		lang: "javascript",
		isFirst: true,
	},
	{
		rank: 2,
		id: "2",
		score: "1.8",
		code: [
			"if (x == true) { return true; }",
			"else if (x == false) { return false; }",
			"else { return !false; }",
		],
		lang: "typescript",
		isFirst: false,
	},
	{
		rank: 3,
		id: "3",
		score: "2.1",
		code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
		lang: "sql",
		isFirst: false,
	},
];

export default function Home() {
	prefetch(trpc.getHomeMetrics.queryOptions());

	return (
		<HydrateClient>
			<main className="flex flex-col items-center">
				{/* Hero */}
				<section className="flex w-full max-w-5xl flex-col items-center gap-8 px-10 pt-20 pb-0">
					<div className="flex flex-col items-center gap-3">
						<div className="flex items-center gap-3">
							<span className="font-mono text-4xl font-bold text-accent-green">
								$
							</span>
							<h1 className="font-mono text-4xl font-bold text-text-primary">
								paste your code. get roasted.
							</h1>
						</div>
						<p className="font-body text-sm text-text-secondary">
							{
								"// drop your code below and we'll rate it — brutally honest or full roast mode"
							}
						</p>
					</div>

					<CodeInputSection />

					<Suspense fallback={<HomeMetricsSkeleton />}>
						<HomeMetrics />
					</Suspense>
				</section>

				{/* Spacer */}
				<div className="h-15" />

				{/* Leaderboard Preview */}
				<section className="flex w-full max-w-5xl flex-col gap-6 px-10">
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-2">
							<SectionTitle>shame_leaderboard</SectionTitle>
							<p className="font-body text-[13px] text-text-tertiary">
								{"// the worst code on the internet, ranked by shame"}
							</p>
						</div>
						<Link href="/leaderboard">
							<Button variant="outline">{"$ view_all >>"}</Button>
						</Link>
					</div>

					{/* Table */}
					<div className="border border-border-primary">
						{/* Header */}
						<div className="flex h-10 items-center border-b border-border-primary bg-bg-surface px-5">
							<span className="w-[50px] font-mono text-xs font-medium text-text-tertiary">
								#
							</span>
							<span className="w-[70px] font-mono text-xs font-medium text-text-tertiary">
								score
							</span>
							<span className="flex-1 font-mono text-xs font-medium text-text-tertiary">
								code
							</span>
							<span className="w-[100px] font-mono text-xs font-medium text-text-tertiary">
								lang
							</span>
						</div>

						{/* Rows */}
						{leaderboardRows.map((row) => (
							<Link
								key={row.rank}
								href={`/roast/${row.id}`}
								className="flex items-start border-b border-border-primary px-5 py-4 transition-colors hover:bg-bg-surface last:border-b-0"
							>
								<span
									className={`w-[50px] font-mono text-xs ${
										row.isFirst ? "text-accent-amber" : "text-text-secondary"
									}`}
								>
									{row.rank}
								</span>
								<span className="w-[70px] font-mono text-xs font-bold text-accent-red">
									{row.score}
								</span>
								<div className="flex flex-1 flex-col gap-0.5">
									{row.code.map((line) => (
										<span
											key={line}
											className={`font-mono text-xs ${
												line.startsWith("//") || line.startsWith("--")
													? "text-text-tertiary"
													: "text-text-primary"
											}`}
										>
											{line}
										</span>
									))}
								</div>
								<span className="w-[100px] font-mono text-xs text-text-secondary">
									{row.lang}
								</span>
							</Link>
						))}
					</div>

					<div className="flex justify-center py-4">
						<span className="font-body text-xs text-text-tertiary">
							{"showing top 3 of 2,847 · view full leaderboard >>"}
						</span>
					</div>
				</section>

				{/* Bottom padding */}
				<div className="h-15" />
			</main>
		</HydrateClient>
	);
}
