import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "devroast — code roast results";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const score = 3.5;
const verdict = "needs_serious_help";
const language = "javascript";
const lines = 7;
const quote = "\u201cthis code was written during a power outage...\u201d";

export default function OGImage() {
	return new ImageResponse(
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				backgroundColor: "#0A0A0A",
				border: "1px solid #2A2A2A",
				padding: 64,
				gap: 28,
				fontFamily: "monospace",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
				<span style={{ color: "#10B981", fontSize: 24, fontWeight: 700 }}>
					{">"}
				</span>
				<span style={{ color: "#FAFAFA", fontSize: 20, fontWeight: 500 }}>
					devroast
				</span>
			</div>

			<div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
				<span
					style={{
						color: "#F59E0B",
						fontSize: 160,
						fontWeight: 900,
						lineHeight: 1,
					}}
				>
					{score}
				</span>
				<span
					style={{
						color: "#4B5563",
						fontSize: 56,
						fontWeight: 400,
						lineHeight: 1,
					}}
				>
					/10
				</span>
			</div>

			<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: "50%",
						backgroundColor: "#EF4444",
					}}
				/>
				<span style={{ color: "#EF4444", fontSize: 20 }}>{verdict}</span>
			</div>

			<span style={{ color: "#4B5563", fontSize: 16 }}>
				lang: {language} · {lines} lines
			</span>

			<span
				style={{
					color: "#FAFAFA",
					fontSize: 22,
					textAlign: "center",
					lineHeight: 1.5,
					maxWidth: "80%",
				}}
			>
				{quote}
			</span>
		</div>,
		{ ...size },
	);
}
