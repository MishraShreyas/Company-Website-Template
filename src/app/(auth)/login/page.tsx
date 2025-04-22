"use client";

import { LoginWithEmailAndPassword } from "@/utils/supabase/auth";
import {
	addToast,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Form,
	Input,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// import { PlaceholderLogo } from "@/components/core/PlaceholderLogo"; // Create this

export default function Page() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const { success } = await LoginWithEmailAndPassword(
				new FormData(e.currentTarget)
			);
			if (!success) {
				throw new Error("Login was not successful.");
			}

			addToast({
				title: "Login Successful",
				description: "Welcome back!",
				color: "success",
				timeout: 5000,
			});

			router.push("/");
		} catch (err: unknown) {
			console.error("Login failed:", err);
			const errorMessage =
				err instanceof Error
					? err.message
					: "Invalid email or password.";
			addToast({
				title: "Login Failed",
				description: errorMessage,
				color: "danger",
				timeout: 5000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
			<Card className="w-fit shadow-xl">
				<CardHeader className="text-center flex-col">
					<div className="mx-auto mb-4 text-center font-mono text-5xl md:text-8xl text-primary font-extrabold">
						{"OBELITHE"}
						{/* Adjust size as needed */}
						{/* <PlaceholderLogo /> */}
					</div>
					<div className="flex flex-col">
						<p className="text-2xl font-bold">Employee Portal</p>
						<p className="text-default-500">
							Sign in to access your workspace
						</p>
					</div>
				</CardHeader>
				<CardBody>
					<Form onSubmit={handleLogin} className="space-y-4">
						<Input
							id="email"
							name="email"
							label="Email"
							type="email"
							isRequired
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
						/>
						<Input
							id="password"
							name="password"
							label="Password"
							type="password"
							isRequired
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
						/>
						<Button
							type="submit"
							className="w-full"
							isLoading={isLoading}
						>
							Login
						</Button>
					</Form>
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
