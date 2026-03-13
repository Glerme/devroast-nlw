interface ScoreRingProps {
	score: number;
	max?: number;
}

type ScoreLevel = "low" | "mid" | "high";

function getLevel(score: number): ScoreLevel {
	if (score < 4) return "low";
	if (score < 7) return "mid";
	return "high";
}

const scoreTextColor: Record<ScoreLevel, string> = {
	low: "text-accent-red",
	mid: "text-accent-amber",
	high: "text-accent-green",
};

const scoreStrokeColor: Record<ScoreLevel, string> = {
	low: "stroke-accent-red",
	mid: "stroke-accent-amber",
	high: "stroke-accent-green",
};

export function ScoreRing({ score, max = 10 }: ScoreRingProps) {
	const radius = 86;
	const circumference = 2 * Math.PI * radius;
	const progress = (score / max) * circumference;
	const level = getLevel(score);

	return (
		<div className="relative h-[180px] w-[180px]">
			<svg
				viewBox="0 0 180 180"
				className="h-full w-full -rotate-90"
				role="img"
				aria-label={`Score: ${score} out of ${max}`}
			>
				<circle
					cx="90"
					cy="90"
					r={radius}
					fill="transparent"
					className="stroke-border-primary"
					strokeWidth="4"
				/>
				<circle
					cx="90"
					cy="90"
					r={radius}
					fill="transparent"
					className={scoreStrokeColor[level]}
					strokeWidth="4"
					strokeDasharray={circumference}
					strokeDashoffset={circumference - progress}
					strokeLinecap="round"
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span
					className={`font-mono text-5xl font-bold ${scoreTextColor[level]}`}
				>
					{score}
				</span>
				<span className="font-mono text-base text-text-tertiary">/{max}</span>
			</div>
		</div>
	);
}
