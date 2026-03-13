import {
	Button,
	CodeBlock,
	DiffBlock,
	IssueCard,
	Navbar,
	ScoreRing,
	SectionTitle,
	Toggle,
} from "@/components/ui";
import { EditorExample } from "./editor-example";

const sampleCode = `function calculateTotal(items) {
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
}`;

const diffLines = [
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
		content: "  return items.reduce((sum, item) => sum + item.price, 0);",
	},
	{ type: "context" as const, content: "}" },
];

function ExampleSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col gap-6">
			<h2 className="font-mono text-lg font-bold text-text-primary">{title}</h2>
			<div className="flex flex-col gap-4">{children}</div>
		</section>
	);
}

function ExampleRow({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2">
			<span className="font-body text-xs text-text-tertiary">{label}</span>
			<div className="flex flex-wrap items-center gap-4">{children}</div>
		</div>
	);
}

export default function ExamplesPage() {
	return (
		<main className="mx-auto flex max-w-5xl flex-col gap-16 px-10 py-16">
			<div className="flex flex-col gap-2">
				<h1 className="font-mono text-2xl font-bold text-text-primary">
					<span className="text-accent-green">{">"}</span> ui_components
				</h1>
				<p className="font-body text-sm text-text-secondary">
					{"// all components and their variants"}
				</p>
			</div>

			{/* Button */}
			<ExampleSection title="Button">
				<ExampleRow label="variant: primary">
					<Button>$ roast_my_code</Button>
					<Button disabled>$ roast_my_code (disabled)</Button>
				</ExampleRow>
				<ExampleRow label="variant: outline">
					<Button variant="outline">$ share_roast</Button>
					<Button variant="outline">$ view_all {">>"}</Button>
				</ExampleRow>
			</ExampleSection>

			{/* Toggle */}
			<ExampleSection title="Toggle">
				<ExampleRow label="default off">
					<Toggle label="roast mode" hint="// sarcasm disabled" />
				</ExampleRow>
				<ExampleRow label="default on">
					<Toggle
						label="roast mode"
						hint="// maximum sarcasm enabled"
						defaultChecked
					/>
				</ExampleRow>
				<ExampleRow label="no label">
					<Toggle />
				</ExampleRow>
			</ExampleSection>

			{/* SectionTitle */}
			<ExampleSection title="SectionTitle">
				<ExampleRow label='prompt: "//"'>
					<SectionTitle>detailed_analysis</SectionTitle>
				</ExampleRow>
				<ExampleRow label='prompt: ">"'>
					<SectionTitle prompt=">">shame_leaderboard</SectionTitle>
				</ExampleRow>
				<ExampleRow label='prompt: "$"'>
					<SectionTitle prompt="$">paste your code. get roasted.</SectionTitle>
				</ExampleRow>
			</ExampleSection>

			{/* ScoreRing */}
			<ExampleSection title="ScoreRing">
				<div className="flex flex-wrap items-center gap-10">
					<div className="flex flex-col items-center gap-2">
						<ScoreRing score={1.2} />
						<span className="font-body text-xs text-text-tertiary">
							low (red)
						</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<ScoreRing score={5.5} />
						<span className="font-body text-xs text-text-tertiary">
							mid (amber)
						</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<ScoreRing score={8.7} />
						<span className="font-body text-xs text-text-tertiary">
							high (green)
						</span>
					</div>
				</div>
			</ExampleSection>

			{/* IssueCard */}
			<ExampleSection title="IssueCard">
				<div className="grid grid-cols-2 gap-5">
					<IssueCard
						severity="critical"
						title="using var instead of const/let"
						description="var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed."
					/>
					<IssueCard
						severity="warning"
						title="imperative loop pattern"
						description="for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations."
					/>
					<IssueCard
						severity="good"
						title="clear naming conventions"
						description="calculateTotal and items are descriptive, self-documenting names that communicate intent without comments."
					/>
					<IssueCard
						severity="good"
						title="single responsibility"
						description="the function does one thing well — calculates a total. no side effects, no mixed concerns."
					/>
				</div>
			</ExampleSection>

			{/* CodeBlock (server component with Shiki) */}
			<ExampleSection title="CodeBlock">
				<ExampleRow label="lang: javascript (Shiki + Vesper theme)">
					<div className="w-full">
						<CodeBlock code={sampleCode} lang="javascript" />
					</div>
				</ExampleRow>
				<ExampleRow label="lang: sql">
					<div className="w-full">
						<CodeBlock
							code={`SELECT * FROM users WHERE 1=1\n-- TODO: add authentication`}
							lang="sql"
						/>
					</div>
				</ExampleRow>
				<ExampleRow label="lang: typescript">
					<div className="w-full">
						<CodeBlock
							code={`const greet = (name: string): string => {\n  return \`hello, \${name}\`;\n};`}
							lang="typescript"
						/>
					</div>
				</ExampleRow>
			</ExampleSection>

			{/* CodeEditor (client component) */}
			<ExampleSection title="CodeEditor">
				<ExampleRow label="editable textarea">
					<div className="w-full">
						<EditorExample />
					</div>
				</ExampleRow>
			</ExampleSection>

			{/* DiffBlock */}
			<ExampleSection title="DiffBlock">
				<DiffBlock
					fileName="your_code.ts → improved_code.ts"
					lines={diffLines}
				/>
			</ExampleSection>

			{/* Navbar */}
			<ExampleSection title="Navbar">
				<ExampleRow label="with right slot">
					<div className="w-full border border-border-primary">
						<Navbar
							rightSlot={
								<span className="font-mono text-[13px] text-text-secondary">
									leaderboard
								</span>
							}
						/>
					</div>
				</ExampleRow>
				<ExampleRow label="without right slot">
					<div className="w-full border border-border-primary">
						<Navbar />
					</div>
				</ExampleRow>
			</ExampleSection>
		</main>
	);
}
