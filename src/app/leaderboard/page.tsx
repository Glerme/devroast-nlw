import type { Metadata } from "next";
import { LeaderboardEntry } from "@/components/ui";

export const metadata: Metadata = {
	title: "shame_leaderboard | devroast",
	description: "the most roasted code on the internet, ranked by shame",
};

const entries = [
	{
		score: 1.2,
		language: "javascript",
		code: 'eval("alert(" + userInput + ")");\nconsole.log("done");',
	},
	{
		score: 1.5,
		language: "php",
		code: '<?php\n$name = $_GET["name"];\necho "Hello, $name";\n?>',
	},
	{
		score: 1.8,
		language: "typescript",
		code: "export function getUser(id: number) {\n  return db.query(`SELECT * FROM users WHERE id = ${id}`);\n}",
	},
	{
		score: 2.1,
		language: "python",
		code: "import pickle\ndata = pickle.loads(user_input)\nprint(data)",
	},
	{
		score: 2.4,
		language: "csharp",
		code: 'public void Execute(string input) {\n  var cmd = new SqlCommand("SELECT * FROM users WHERE name = \'" + input + "\'");\n  cmd.ExecuteReader();\n}',
	},
	{
		score: 2.9,
		language: "ruby",
		code: 'def show\n  user = User.find_by("name = \'#{params[:name]}\'")\n  render json: user\nend',
	},
	{
		score: 3.3,
		language: "javascript",
		code: "for (var i = 0; i < arr.length; i++) {\n  setTimeout(function() {\n    console.log(arr[i]);\n  }, 1000);\n}",
	},
	{
		score: 3.7,
		language: "go",
		code: 'func handler(w http.ResponseWriter, r *http.Request) {\n\tbody, _ := io.ReadAll(r.Body)\n\tfmt.Fprintf(w, string(body))\n}',
	},
	{
		score: 4.1,
		language: "swift",
		code: "func fetchData() {\n  let url = URL(string: userInput)!\n  let data = try! Data(contentsOf: url)\n  print(String(data: data, encoding: .utf8)!)\n}",
	},
	{
		score: 4.5,
		language: "python",
		code: 'password = "admin123"\ndef login(user, pwd):\n    if pwd == password:\n        return True',
	},
];

const totalSubmissions = 2847;
const avgScore =
	Math.round(
		(entries.reduce((sum, e) => sum + e.score, 0) / entries.length) * 10,
	) / 10;

export default function LeaderboardPage() {
	return (
		<main className="px-20 py-10">
			<div className="flex flex-col gap-4">
				<h1 className="font-mono text-[28px] font-bold text-text-primary">
					<span className="text-[32px] text-accent-green">{">"}</span>{" "}
					shame_leaderboard
				</h1>
				<p className="font-body text-sm text-text-secondary">
					// the most roasted code on the internet
				</p>
				<p className="font-body text-xs text-text-tertiary">
					{totalSubmissions.toLocaleString()} submissions &middot; avg
					score: {avgScore}/10
				</p>
			</div>

			<div className="mt-10 flex flex-col gap-5">
				{entries.map((entry, i) => (
					<LeaderboardEntry
						key={i}
						rank={i + 1}
						score={entry.score}
						language={entry.language}
						code={entry.code}
						codeLines={entry.code.split("\n").length}
					/>
				))}
			</div>
		</main>
	);
}
