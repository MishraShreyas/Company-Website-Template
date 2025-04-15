import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "@/app/providers";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "[Your Brand Name] - Employee Portal", // Placeholder
	description: "Streamlining work for the [Your Brand Name] team.", // Placeholder
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>
					<AuthProvider>
						<main>
							<Header>{children}</Header>
						</main>
					</AuthProvider>
				</Providers>
			</body>
		</html>
	);
}
