import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/ui";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

export const metadata: Metadata = {
	title: "devroast",
	description: "paste your code. get roasted.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<TRPCReactProvider>
					<Navbar
						rightSlot={
							<Link
								href="/leaderboard"
								className="font-mono text-[13px] text-text-secondary transition-colors hover:text-text-primary"
							>
								leaderboard
							</Link>
						}
					/>
					{children}
				</TRPCReactProvider>
			</body>
		</html>
	);
}
