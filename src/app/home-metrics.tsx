"use client";

import NumberFlow from "@number-flow/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";

export function HomeMetrics() {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.getHomeMetrics.queryOptions());
	const [mounted, setMounted] = useState(false);
	const [animated, setAnimated] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		const id = requestAnimationFrame(() => setAnimated(true));
		return () => cancelAnimationFrame(id);
	}, [mounted]);

	if (!mounted) {
		return (
			<div className="flex items-center gap-6">
				<span className="font-body text-xs text-text-tertiary">
					0 codes roasted
				</span>
				<span className="font-mono text-xs text-text-tertiary">·</span>
				<span className="font-body text-xs text-text-tertiary">
					avg score: 0.0/10
				</span>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-6">
			<span className="inline-flex items-center gap-1 font-body text-xs text-text-tertiary">
				<NumberFlow
					value={animated ? data.totalRoasts : 0}
					format={{ useGrouping: true }}
					transformTiming={{ duration: 900, easing: "ease-out" }}
					className="font-body text-xs text-text-tertiary"
				/>
				codes roasted
			</span>
			<span className="font-mono text-xs text-text-tertiary">·</span>
			<span className="inline-flex items-center gap-1 font-body text-xs text-text-tertiary">
				avg score:
				<NumberFlow
					value={animated ? data.avgScore : 0}
					format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
					transformTiming={{ duration: 900, easing: "ease-out" }}
					className="font-body text-xs text-text-tertiary"
				/>
				/10
			</span>
		</div>
	);
}

export function HomeMetricsSkeleton() {
	return (
		<div className="flex items-center gap-6">
			<span className="inline-block h-4 w-32 animate-pulse bg-bg-elevated" />
			<span className="font-mono text-xs text-text-tertiary">·</span>
			<span className="inline-block h-4 w-28 animate-pulse bg-bg-elevated" />
		</div>
	);
}
