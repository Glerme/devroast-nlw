import type { Extension } from "@codemirror/state";

const LANGUAGES = {
	javascript: {
		label: "JavaScript",
		ext: () =>
			import("@codemirror/lang-javascript").then((m) =>
				m.javascript({ jsx: true }),
			),
	},
	typescript: {
		label: "TypeScript",
		ext: () =>
			import("@codemirror/lang-javascript").then((m) =>
				m.javascript({ jsx: true, typescript: true }),
			),
	},
	python: {
		label: "Python",
		ext: () => import("@codemirror/lang-python").then((m) => m.python()),
	},
	java: {
		label: "Java",
		ext: () => import("@codemirror/lang-java").then((m) => m.java()),
	},
	cpp: {
		label: "C/C++",
		ext: () => import("@codemirror/lang-cpp").then((m) => m.cpp()),
	},
	html: {
		label: "HTML",
		ext: () => import("@codemirror/lang-html").then((m) => m.html()),
	},
	css: {
		label: "CSS",
		ext: () => import("@codemirror/lang-css").then((m) => m.css()),
	},
	json: {
		label: "JSON",
		ext: () => import("@codemirror/lang-json").then((m) => m.json()),
	},
	markdown: {
		label: "Markdown",
		ext: () => import("@codemirror/lang-markdown").then((m) => m.markdown()),
	},
	rust: {
		label: "Rust",
		ext: () => import("@codemirror/lang-rust").then((m) => m.rust()),
	},
	go: {
		label: "Go",
		ext: () => import("@codemirror/lang-go").then((m) => m.go()),
	},
	php: {
		label: "PHP",
		ext: () => import("@codemirror/lang-php").then((m) => m.php()),
	},
	sql: {
		label: "SQL",
		ext: () => import("@codemirror/lang-sql").then((m) => m.sql()),
	},
	xml: {
		label: "XML",
		ext: () => import("@codemirror/lang-xml").then((m) => m.xml()),
	},
	plaintext: {
		label: "Plain Text",
		ext: () => Promise.resolve([] as Extension),
	},
} as const;

export type LanguageId = keyof typeof LANGUAGES;

export { LANGUAGES };

export async function getLanguageExtension(id: LanguageId): Promise<Extension> {
	return LANGUAGES[id].ext();
}
