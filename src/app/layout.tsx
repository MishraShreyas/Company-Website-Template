import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Obelithe Studios",
	description: "An indie game dev company based in India.",
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<GoogleAnalytics gaId="G-DVP3058CWF" />
			<body className={inter.className}>
				<Providers>
					<main>{children}</main>
				</Providers>
			</body>
		</html>
	);
}
