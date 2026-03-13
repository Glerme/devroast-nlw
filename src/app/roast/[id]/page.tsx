import type { Metadata } from "next";
import Link from "next/link";
import {
	Button,
	CodeBlock,
	DiffBlock,
	IssueCard,
	ScoreRing,
	SectionTitle,
} from "@/components/ui";

export const metadata: Metadata = {
	title: "roast_results | devroast",
	description: "your code has been roasted",
};

const mockRoast = {
	score: 3.5,
	verdict: "needs_serious_help",
	roastQuote:
		'"this code looks like it was written during a power outage... in 2005."',
	language: "javascript",
	lines: 16,
	code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`,
	issues: [
		{
			severity: "critical" as const,
			title: "using var instead of const/let",
			description:
				"var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
		},
		{
			severity: "warning" as const,
			title: "imperative loop pattern",
			description:
				"for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
		},
		{
			severity: "good" as const,
			title: "clear naming conventions",
			description:
				"calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
		},
		{
			severity: "good" as const,
			title: "single responsibility",
			description:
				"the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
		},
	],
	diff: {
		fileName: "your_code.ts → improved_code.ts",
		lines: [
			{ type: "context" as const, content: "function calculateTotal(items) {" },
			{ type: "removed" as const, content: "  var total = 0;" },
			{
				type: "removed" as const,
				content: "  for (var i = 0; i < items.length; i++) {",
			},
			{
				type: "removed" as const,
				content: "    total = total + items[i].price;",
			},
			{ type: "removed" as const, content: "  }" },
			{ type: "removed" as const, content: "  return total;" },
			{
				type: "added" as const,
				content:
					"  return items.reduce((sum, item) => sum + item.price, 0);",
			},
			{ type: "context" as const, content: "}" },
		],
	},
};

export default function RoastResultsPage() {
	return (
		<main className="flex flex-col items-center">
			<div className="flex w-full max-w-5xl flex-col gap-10 px-10 py-10 md:px-20">
				{/* Score Hero */}
				<section className="flex flex-col items-center gap-12 md:flex-row md:items-center">
					<ScoreRing score={mockRoast.score} />

					<div className="flex flex-1 flex-col gap-4">
						<div className="flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-accent-red" />
							<span className="font-mono text-[13px] font-medium text-accent-red">
								verdict: {mockRoast.verdict}
							</span>
						</div>

						<p className="font-body text-xl leading-[1.5] text-text-primary">
							{mockRoast.roastQuote}
						</p>

						<div className="flex items-center gap-4">
							<span className="font-mono text-xs text-text-tertiary">
								lang: {mockRoast.language}
							</span>
							<span className="font-mono text-xs text-text-tertiary">·</span>
							<span className="font-mono text-xs text-text-tertiary">
								{mockRoast.lines} lines
							</span>
						</div>

						<div className="flex items-center gap-3">
							<Button variant="outline">$ share_roast</Button>
							<Link href="/">
								<Button variant="outline">$ roast_another</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* Divider */}
				<div className="h-px w-full bg-border-primary" />

				{/* Submitted Code */}
				<section className="flex flex-col gap-4">
					<SectionTitle>your_submission</SectionTitle>
					<CodeBlock code={mockRoast.code} lang={mockRoast.language} />
				</section>

				{/* Divider */}
				<div className="h-px w-full bg-border-primary" />

				{/* Detailed Analysis */}
				<section className="flex flex-col gap-6">
					<SectionTitle>detailed_analysis</SectionTitle>
					<div className="flex flex-col gap-5">
						<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
							{mockRoast.issues.map((issue) => (
								<IssueCard
									key={issue.title}
									severity={issue.severity}
									title={issue.title}
									description={issue.description}
								/>
							))}
						</div>
					</div>
				</section>

				{/* Divider */}
				<div className="h-px w-full bg-border-primary" />

				{/* Suggested Fix */}
				<section className="flex flex-col gap-6">
					<SectionTitle>suggested_fix</SectionTitle>
					<DiffBlock
						fileName={mockRoast.diff.fileName}
						lines={mockRoast.diff.lines}
					/>
				</section>
			</div>
		</main>
	);
}
