import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
	getHomeMetrics: baseProcedure.query(async () => {
		// TODO: replace with real DB query
		return {
			totalRoasts: 2847,
			avgScore: 4.2,
		};
	}),
});

export type AppRouter = typeof appRouter;
