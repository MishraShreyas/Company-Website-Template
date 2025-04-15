"use client";

import { auth } from "@/lib/firebase";
import {
	addToast,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Input,
} from "@heroui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
// import { PlaceholderLogo } from "@/components/core/PlaceholderLogo"; // Create this

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			await signInWithEmailAndPassword(auth, email, password);
			// AuthProvider will handle profile fetching and logging activity
			// Redirect after login
			const redirectedFrom = searchParams.get("redirectedFrom") || "/";
			router.push(redirectedFrom);

			// // ** Cookie Setting (Server-Side Recommended) **
			// // If using middleware with cookie check, you need to set the cookie.
			// // This *client-side* setting is NOT HttpOnly and less secure.
			// // Ideally, call an API route after login to set a secure cookie.
			// const idToken = await auth.currentUser?.getIdToken();
			// if (idToken) {
			//    // Example: Call an API route
			//    // await fetch('/api/auth/set-cookie', { method: 'POST', body: JSON.stringify({ idToken }) });
			//    // Or less secure client-side cookie:
			//    // document.cookie = `firebaseAuthToken=${idToken}; path=/; max-age=3600`; // 1 hour example
			// } else {
			//    throw new Error("Could not get ID token.");
			// }

			addToast({
				title: "Login Successful",
				description: "Welcome back!",
			});
		} catch (err: unknown) {
			console.error("Login failed:", err);
			const errorMessage =
				err instanceof Error
					? err.message
					: "Invalid email or password.";
			setError(errorMessage);
			addToast({
				title: "Login Failed",
				description: errorMessage,
				color: "danger",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
			<Card className="w-full max-w-md shadow-xl">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 w-20 h-20">
						{" LOGO HERE "}
						{/* Adjust size as needed */}
						{/* <PlaceholderLogo /> */}
					</div>
					<div className="flex flex-col">
						<p className="text-2xl font-bold">
							[Your Brand Name] Portal
						</p>
						<p className="text-default-500">
							Sign in to access your workspace
						</p>
					</div>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<Input
								id="email"
								label="Email"
								type="email"
								placeholder="m@example.com"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isLoading}
							/>
						</div>
						<div className="space-y-2">
							<Input
								id="password"
								label="Password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
							/>
						</div>
						{error && (
							<p className="text-sm text-destructive">{error}</p>
						)}
						<Button
							type="submit"
							className="w-full"
							isLoading={isLoading}
						>
							Login
						</Button>
					</form>
				</CardBody>
				<CardFooter className="text-center text-sm text-muted-foreground">
					{/* Add Forgot Password link later */}
					{/* <p>Forgot password?</p> */}
				</CardFooter>
			</Card>
		</div>
	);
}

// Create components/core/PlaceholderLogo.tsx
// Example:
// import Image from 'next/image';
// export const PlaceholderLogo = () => <Image src="/placeholder-logo.svg" alt="Brand Logo" width={80} height={80} />;
