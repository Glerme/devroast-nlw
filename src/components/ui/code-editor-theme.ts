import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

export const devRoastTheme = createTheme({
	theme: "dark",
	settings: {
		background: "#111111",
		foreground: "#fafafa",
		caret: "#10b981",
		selection: "#2a2a2a",
		selectionMatch: "#2a2a2a",
		lineHighlight: "#1a1a1a",
		gutterBackground: "#0f0f0f",
		gutterForeground: "#4b5563",
		gutterBorder: "#2a2a2a",
	},
	styles: [
		{ tag: t.comment, color: "#4b5563" },
		{ tag: t.string, color: "#10b981" },
		{ tag: t.number, color: "#f59e0b" },
		{ tag: t.keyword, color: "#ef4444" },
		{ tag: t.function(t.variableName), color: "#06b6d4" },
		{ tag: t.typeName, color: "#f59e0b" },
		{ tag: t.operator, color: "#6b7280" },
		{ tag: t.bool, color: "#f59e0b" },
		{ tag: t.propertyName, color: "#fafafa" },
	],
});
