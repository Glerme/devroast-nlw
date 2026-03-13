"use client";

import type { Extension } from "@codemirror/state";
import { useCallback, useEffect, useState } from "react";
import {
	getLanguageExtension,
	LANGUAGES,
	type LanguageId,
} from "./code-editor-languages";
import { useLanguageDetection } from "./use-language-detection";

const MAX_CHARS = 5000;

interface CodeEditorProps {
	value?: string;
	onChange?: (value: string) => void;
	language?: LanguageId;
	className?: string;
}

type SelectorValue = "auto" | LanguageId;

export function CodeEditor({
	value = "",
	onChange,
	language,
	className = "",
}: CodeEditorProps) {
	const [mounted, setMounted] = useState(false);
	const [selectorValue, setSelectorValue] = useState<SelectorValue>(
		language ?? "auto",
	);
	const [langExtension, setLangExtension] = useState<Extension>([]);
	const [CodeMirrorComponent, setCodeMirrorComponent] = useState<
		typeof import("@uiw/react-codemirror").default | null
	>(null);
	const [theme, setTheme] = useState<Extension | null>(null);

	const detectedLanguage = useLanguageDetection(value);

	const activeLanguage: LanguageId =
		selectorValue === "auto" ? detectedLanguage : selectorValue;

	// SSR guard + lazy load CodeMirror and theme
	useEffect(() => {
		let cancelled = false;
		Promise.all([
			import("@uiw/react-codemirror"),
			import("./code-editor-theme"),
		]).then(([cm, themeModule]) => {
			if (!cancelled) {
				setCodeMirrorComponent(() => cm.default);
				setTheme(themeModule.devRoastTheme);
				setMounted(true);
			}
		});
		return () => {
			cancelled = true;
		};
	}, []);

	// Load language extension when active language changes
	useEffect(() => {
		let cancelled = false;
		getLanguageExtension(activeLanguage).then((ext) => {
			if (!cancelled) {
				setLangExtension(ext);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [activeLanguage]);

	const handleLanguageChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setSelectorValue(e.target.value as SelectorValue);
		},
		[],
	);

	const handleChange = useCallback(
		(val: string) => {
			onChange?.(val.slice(0, MAX_CHARS));
		},
		[onChange],
	);

	const selectorLabel =
		selectorValue === "auto"
			? `auto-detect (${LANGUAGES[detectedLanguage].label})`
			: LANGUAGES[selectorValue].label;

	return (
		<div
			className={`overflow-hidden border border-border-primary bg-bg-input ${className}`}
		>
			<div className="flex h-10 items-center justify-between border-b border-border-primary px-4">
				<div className="flex items-center gap-2">
					<span className="h-3 w-3 rounded-full bg-dot-close" />
					<span className="h-3 w-3 rounded-full bg-dot-minimize" />
					<span className="h-3 w-3 rounded-full bg-dot-maximize" />
				</div>
			<div className="relative flex items-center gap-1">
				<span className="pointer-events-none font-mono text-xs text-text-secondary">
					{selectorLabel}
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="pointer-events-none text-text-secondary"
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
				<select
					value={selectorValue}
					onChange={handleLanguageChange}
					aria-label="Select language"
					className="absolute inset-0 cursor-pointer opacity-0"
				>
						<option value="auto" className="bg-bg-surface">
							Auto-detect
						</option>
						{Object.entries(LANGUAGES).map(([id, { label }]) => (
							<option key={id} value={id} className="bg-bg-surface">
								{label}
							</option>
						))}
					</select>
				</div>
			</div>
		{mounted && CodeMirrorComponent && theme ? (
			<CodeMirrorComponent
				value={value}
				onChange={handleChange}
				theme={theme}
				extensions={langExtension ? [langExtension] : []}
				placeholder="// paste your code here..."
				basicSetup={{
					lineNumbers: true,
					bracketMatching: true,
					foldGutter: false,
					highlightActiveLine: true,
				}}
				minHeight="320px"
				maxHeight="520px"
			/>
		) : (
			<div className="flex min-h-[320px]">
				<div className="w-12 shrink-0 border-r border-border-primary bg-bg-surface" />
				<div className="flex-1 p-4 font-mono text-xs text-text-tertiary">
					{"// loading editor..."}
				</div>
			</div>
		)}
		<div className="flex justify-end border-t border-border-primary px-4 py-1.5">
			<span
				className={`font-mono text-xs tabular-nums ${
					value.length >= MAX_CHARS
						? "text-accent-red"
						: value.length >= MAX_CHARS * 0.9
							? "text-accent-amber"
							: "text-text-tertiary"
				}`}
			>
				{value.length} / {MAX_CHARS}
			</span>
		</div>
	</div>
);
}
