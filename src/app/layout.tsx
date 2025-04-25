import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getSubdomain } from "@/lib/server-utils";
import { SidebarLayout } from "@/components/layout/Sidebar";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
});

export const metadata: Metadata = {
	title: "Obelithe Studios",
	description: "An indie game dev company based in India.",
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const subDomain = await getSubdomain();

	const Wrapper = ({ children }: { children: React.ReactNode }) => {
		switch (subDomain) {
			case "admin":
				return <SidebarLayout subdomain={subDomain}>{children}</SidebarLayout>;
			case "employee":
				return <SidebarLayout subdomain={subDomain}>{children}</SidebarLayout>;
			default:
				return children;
		}
	};

	return (
		<html lang="en" suppressHydrationWarning>
			<GoogleAnalytics gaId="G-DVP3058CWF" />
			<body className={`${poppins.className}`}>
				<Providers>
					<main>
						<Wrapper>{children}</Wrapper>
					</main>
				</Providers>
			</body>
		</html>
	);
}
