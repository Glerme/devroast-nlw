"use client";

import { useEffect, useRef, useState } from "react";
import type { LanguageId } from "./code-editor-languages";

type LangPattern = {
	id: LanguageId;
	patterns: RegExp[];
	weight?: number;
};

const LANG_PATTERNS: LangPattern[] = [
	{
		id: "typescript",
		patterns: [
			/\b(interface|type|enum)\s+\w+/,
			/:\s*(string|number|boolean|void|never|any)\b/,
			/\bas\s+\w+/,
			/<\w+(\s*,\s*\w+)*>/,
			/\bimport\s+type\b/,
		],
		weight: 1.2,
	},
	{
		id: "javascript",
		patterns: [
			/\b(const|let|var)\s+\w+\s*=/,
			/\b(function|=>)\b/,
			/\bconsole\.(log|warn|error)\b/,
			/\b(require|module\.exports|export\s+default)\b/,
			/\bdocument\.\w+/,
		],
	},
	{
		id: "python",
		patterns: [
			/\bdef\s+\w+\s*\(/,
			/\bclass\s+\w+.*:/,
			/\b(import|from)\s+\w+/,
			/\bif\s+.*:\s*$/m,
			/\bprint\s*\(/,
			/\bself\.\w+/,
		],
	},
	{
		id: "java",
		patterns: [
			/\b(public|private|protected)\s+(static\s+)?(void|int|String|class)\b/,
			/\bSystem\.out\.println\b/,
			/\bimport\s+java\./,
			/\bnew\s+\w+\s*\(/,
			/\b@Override\b/,
		],
	},
	{
		id: "cpp",
		patterns: [
			/\b#include\s*[<"]/,
			/\bstd::\w+/,
			/\b(cout|cin|endl)\b/,
			/\b(nullptr|nullptr_t)\b/,
			/\btemplate\s*</,
		],
	},
	{
		id: "rust",
		patterns: [
			/\bfn\s+\w+\s*\(/,
			/\blet\s+mut\b/,
			/\b(impl|trait|struct|enum)\s+\w+/,
			/\b(println!|vec!|format!)\b/,
			/\b(Option|Result|Vec|Box)<\w+>/,
		],
	},
	{
		id: "go",
		patterns: [
			/\bfunc\s+(\(\w+\s+\*?\w+\)\s+)?\w+\s*\(/,
			/\bpackage\s+\w+/,
			/\b(fmt|log)\.\w+/,
			/\b:=\b/,
			/\bgo\s+func\b/,
		],
	},
	{
		id: "html",
		patterns: [
			/<(!DOCTYPE|html|head|body|div|span|p|a|img)\b/i,
			/<\/\w+>/,
			/\bclass=["']/,
			/<script\b/i,
			/<style\b/i,
		],
	},
	{
		id: "css",
		patterns: [
			/\b[\w-]+\s*:\s*[\w#"'-]+\s*;/,
			/\.([\w-]+)\s*\{/,
			/#[\w-]+\s*\{/,
			/@(media|keyframes|import|font-face)\b/,
			/\b(display|margin|padding|color|background)\s*:/,
		],
	},
	{
		id: "json",
		patterns: [/^\s*\{[\s\S]*"[\w-]+":\s*/m, /^\s*\[[\s\S]*\{/m],
		weight: 0.8,
	},
	{
		id: "sql",
		patterns: [
			/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i,
			/\b(FROM|WHERE|JOIN|GROUP\s+BY|ORDER\s+BY)\b/i,
			/\bTABLE\s+\w+/i,
		],
	},
	{
		id: "php",
		patterns: [
			/<\?php\b/,
			/\$\w+\s*=/,
			/\bfunction\s+\w+\s*\(/,
			/\b(echo|print)\s+/,
			/\b->\w+/,
		],
	},
	{
		id: "markdown",
		patterns: [
			/^#{1,6}\s+\w+/m,
			/\[.*\]\(.*\)/,
			/^[-*+]\s+/m,
			/^```\w*/m,
			/^\*\*.*\*\*/m,
		],
	},
	{
		id: "xml",
		patterns: [
			/<\?xml\b/,
			/<[\w:-]+(\s+[\w:-]+="[^"]*")*\s*\/?>/,
			/<!\[CDATA\[/,
		],
	},
];

function detectLanguage(code: string): LanguageId {
	if (!code.trim()) return "plaintext";

	let bestId: LanguageId = "plaintext";
	let bestScore = 0;

	for (const lang of LANG_PATTERNS) {
		let matches = 0;
		for (const pattern of lang.patterns) {
			if (pattern.test(code)) matches++;
		}
		const score = (matches / lang.patterns.length) * (lang.weight ?? 1);
		if (score > bestScore && matches >= 2) {
			bestScore = score;
			bestId = lang.id;
		}
	}

	return bestId;
}

export function useLanguageDetection(code: string) {
	const [detectedLanguage, setDetectedLanguage] = useState<LanguageId>(() =>
		code.trim() ? detectLanguage(code) : "plaintext",
	);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		if (!code.trim()) {
			setDetectedLanguage("plaintext");
			return;
		}

		timerRef.current = setTimeout(() => {
			setDetectedLanguage(detectLanguage(code));
		}, 500);

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [code]);

	return detectedLanguage;
}
