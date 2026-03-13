import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/node-postgres";
import { issues, roasts, suggestions } from "./schema";

const TOTAL_ROASTS = 100;

const languages = [
	"javascript",
	"typescript",
	"python",
	"go",
	"rust",
	"sql",
	"java",
	"csharp",
	"php",
	"ruby",
	"swift",
	"kotlin",
] as const;

const severities = ["critical", "warning", "good"] as const;

const codeSnippets: Record<string, string[]> = {
	javascript: [
		'var x = 1;\nif (x == "1") {\n  console.log("equal");\n}',
		"function foo() {\n  return arguments[0] + arguments[1];\n}",
		'eval("alert(" + userInput + ")");\nconsole.log("done");',
		"for (var i = 0; i < arr.length; i++) {\n  setTimeout(function() {\n    console.log(arr[i]);\n  }, 1000);\n}",
	],
	typescript: [
		"const data: any = fetchData();\nconst name = data.user.name;",
		"function parse(input: string) {\n  // @ts-ignore\n  return JSON.parse(input).value;\n}",
		"export function getUser(id: number) {\n  return db.query(`SELECT * FROM users WHERE id = ${id}`);\n}",
	],
	python: [
		"import pickle\ndata = pickle.loads(user_input)\nprint(data)",
		"def process(items):\n    result = []\n    for i in range(len(items)):\n        result.append(items[i] * 2)\n    return result",
		'password = "admin123"\ndef login(user, pwd):\n    if pwd == password:\n        return True',
	],
	go: [
		'func handler(w http.ResponseWriter, r *http.Request) {\n\tbody, _ := io.ReadAll(r.Body)\n\tfmt.Fprintf(w, string(body))\n}',
		"func divide(a, b int) int {\n\treturn a / b\n}",
	],
	rust: [
		"fn main() {\n    let mut v = vec![1, 2, 3];\n    let first = &v[0];\n    v.push(4);\n    println!(\"{}\", first);\n}",
		'fn parse_input(s: &str) -> i32 {\n    s.parse().unwrap()\n}',
	],
	sql: [
		"SELECT * FROM users WHERE name = '" + "' OR 1=1 --';\nDROP TABLE users;",
		"SELECT *\nFROM orders o, customers c, products p\nWHERE o.customer_id = c.id\n  AND o.product_id = p.id;",
	],
	java: [
		'public class Main {\n  public static void main(String[] args) {\n    String password = "secret123";\n    System.out.println(password);\n  }\n}',
		"public void process(Object obj) {\n  if (obj instanceof String) {\n    String s = (String) obj;\n    // ...\n  }\n}",
	],
	csharp: [
		'public void Execute(string input) {\n  var cmd = new SqlCommand("SELECT * FROM users WHERE name = \'" + input + "\'");\n  cmd.ExecuteReader();\n}',
	],
	php: [
		'<?php\n$name = $_GET["name"];\necho "Hello, $name";\n?>',
		'<?php\n$conn = mysql_connect("localhost", "root", "");\n$result = mysql_query("SELECT * FROM users WHERE id = " . $_GET["id"]);\n?>',
	],
	ruby: [
		'def show\n  user = User.find_by("name = \'#{params[:name]}\'")\n  render json: user\nend',
	],
	swift: [
		"func fetchData() {\n  let url = URL(string: userInput)!\n  let data = try! Data(contentsOf: url)\n  print(String(data: data, encoding: .utf8)!)\n}",
	],
	kotlin: [
		'fun main() {\n  val input: String? = readLine()\n  println(input!!.length)\n}',
	],
};

const issueTitles: Record<string, string[]> = {
	critical: [
		"SQL Injection vulnerability",
		"Hardcoded credentials",
		"Remote Code Execution risk",
		"Unsanitized user input",
		"Insecure deserialization",
		"Missing authentication check",
	],
	warning: [
		"Implicit type coercion",
		"Missing error handling",
		"Unused variable declaration",
		"Overly broad type annotation",
		"Missing null check",
		"Inefficient loop pattern",
		"Deprecated API usage",
	],
	good: [
		"Proper use of const",
		"Good error boundary",
		"Clean function signature",
		"Appropriate use of generics",
	],
};

const issueDescriptions: Record<string, string[]> = {
	critical: [
		"User input is interpolated directly into the query string without parameterization, allowing attackers to execute arbitrary SQL.",
		"Sensitive credentials are stored as plaintext in the source code. Use environment variables or a secrets manager instead.",
		"The use of eval() or equivalent with user-controlled input allows arbitrary code execution on the server.",
		"Input from external sources is used without validation or sanitization, opening the door to injection attacks.",
	],
	warning: [
		"Using loose equality (==) can lead to unexpected type coercion. Prefer strict equality (===).",
		"The error from this operation is silently ignored. Add proper error handling to avoid masking failures.",
		"This variable is declared but never used. Remove it to keep the codebase clean.",
		"Using 'any' defeats the purpose of TypeScript's type system. Define a proper interface.",
		"Accessing a property without checking for null/undefined first may cause runtime errors.",
		"Iterating with index-based access is less idiomatic. Consider using map/filter/forEach.",
	],
	good: [
		"Good use of immutable bindings. This prevents accidental reassignment and signals intent clearly.",
		"Error boundaries are properly set up to catch and handle rendering failures gracefully.",
		"The function signature is clean, with well-named parameters and a clear return type.",
	],
};

const roastTexts = [
	"This code is so bad it made my linter file a restraining order. The variable naming alone is a war crime against readability.",
	"I've seen spaghetti code before, but this is a whole Italian restaurant. Every function is a new adventure in confusion.",
	"Congratulations, you've invented a new design pattern: chaos-driven development. Not even a debugger can save this.",
	"This code doesn't just have bugs — it's an entire ecosystem. Darwin would be fascinated.",
	"If code reviews were court trials, this would get a life sentence. No parole.",
	"Your error handling strategy appears to be 'hope for the best'. Bold move, let's see how that works in production.",
	"This is the kind of code that makes senior developers update their LinkedIn profiles.",
	"I'm not saying this code is bad, but it just triggered three different static analysis tools to uninstall themselves.",
	"The only thing consistent about this code is its inconsistency. Pick a style, any style. Please.",
	"This code has more security holes than Swiss cheese. An attacker wouldn't even need to try.",
	"Your indentation tells a story of a developer who has given up on life. Tabs AND spaces? Really?",
	"This function is doing so many things it needs its own project manager.",
	"I've reviewed a lot of code in my career, but this is the first time I've considered switching careers because of it.",
	"The performance characteristics of this code can be best described as 'eventually consistent with heat death of the universe'.",
	"Not terrible, but definitely not something you'd want to show at a job interview. Or anywhere, really.",
];

function pickRandom<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateDiffLines(language: string) {
	const fileExtensions: Record<string, string> = {
		javascript: "js",
		typescript: "ts",
		python: "py",
		go: "go",
		rust: "rs",
		sql: "sql",
		java: "java",
		csharp: "cs",
		php: "php",
		ruby: "rb",
		swift: "swift",
		kotlin: "kt",
	};

	const ext = fileExtensions[language] || "txt";
	const fileName = `${faker.word.noun()}.${ext}`;

	const lines: Array<{
		type: "context" | "added" | "removed";
		content: string;
	}> = [
		{ type: "context", content: `  // ${faker.lorem.sentence()}` },
		{
			type: "removed",
			content: `  ${faker.lorem.words({ min: 3, max: 8 })}`,
		},
		{ type: "added", content: `  ${faker.lorem.words({ min: 3, max: 8 })}` },
		{ type: "context", content: "  }" },
	];

	return { fileName, diffLines: lines };
}

async function seed() {
	const db = drizzle(process.env.DATABASE_URL!, { casing: "snake_case" });

	console.log("Cleaning existing data...");
	await db.delete(suggestions);
	await db.delete(issues);
	await db.delete(roasts);

	console.log(`Seeding ${TOTAL_ROASTS} roasts...`);

	for (let i = 0; i < TOTAL_ROASTS; i++) {
		const language = pickRandom(languages);
		const snippets = codeSnippets[language] ?? codeSnippets.javascript;
		const code = pickRandom(snippets);
		const codeLines = code.split("\n").length;
		const score = Math.round(faker.number.float({ min: 0.5, max: 9.8 }) * 10) / 10;

		const [roast] = await db
			.insert(roasts)
			.values({
				code,
				language,
				score,
				roastText: pickRandom(roastTexts),
				codeLines,
				createdAt: faker.date.recent({ days: 30 }),
			})
			.returning({ id: roasts.id });

		const issueCount = faker.number.int({ min: 1, max: 5 });

		for (let j = 0; j < issueCount; j++) {
			const severity = pickRandom(severities);

			const [issue] = await db
				.insert(issues)
				.values({
					roastId: roast.id,
					severity,
					title: pickRandom(issueTitles[severity]),
					description: pickRandom(issueDescriptions[severity]),
					createdAt: faker.date.recent({ days: 30 }),
				})
				.returning({ id: issues.id });

			if (faker.datatype.boolean(0.6)) {
				const { fileName, diffLines } = generateDiffLines(language);

				await db.insert(suggestions).values({
					issueId: issue.id,
					fileName,
					diffLines,
					createdAt: faker.date.recent({ days: 30 }),
				});
			}
		}

		if ((i + 1) % 25 === 0) {
			console.log(`  ${i + 1}/${TOTAL_ROASTS} roasts created`);
		}
	}

	console.log("Seed completed!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
