"use client";
import { updatePassword } from "@/lib/db";
import { addToast, Button, Form, Input } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function Page() {
	const [loading, setLoading] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const [viewOldPassword, setViewOldPassword] = useState(false);
	const [viewNewPassword, setViewNewPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);
		try {
			await updatePassword(oldPassword, newPassword);
			addToast({
				title: "Password updated successfully",
				severity: "success",
				color: "success",
				timeout: 3000,
			});
		} catch (error: unknown) {
			addToast({
				title:
					error instanceof Error
						? error.message
						: "An error occurred",
				color: "danger",
				severity: "danger",
				timeout: 3000,
			});
		}

		setLoading(false);
	};
	return (
		<div className="flex flex-col gap-4 max-w-5xl">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="text-2xl font-bold text-gray-800 dark:text-gray-200"
			>
				Settings
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="text-gray-600 dark:text-gray-400"
			>
				Welcome to the settings page. Here you can manage your account
				settings, privacy settings, and more.
			</motion.p>

			<Form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Input
					type={viewOldPassword ? "text" : "password"}
					label="Old Password"
					value={oldPassword}
					endContent={
						<button
							className="focus:outline-none cursor-pointer"
							type="button"
							aria-label="Toggle password visibility"
							onClick={() => setViewOldPassword(!viewOldPassword)}
						>
							{viewOldPassword ? <Eye /> : <EyeOff />}
						</button>
					}
					onChange={(e) => setOldPassword(e.target.value)}
					required
					disabled={loading}
					className="max-w-xs"
				/>
				<Input
					type={viewNewPassword ? "text" : "password"}
					label="New Password"
					value={newPassword}
					endContent={
						<button
							className="focus:outline-none cursor-pointer"
							type="button"
							aria-label="Toggle password visibility"
							onClick={() => setViewNewPassword(!viewNewPassword)}
						>
							{viewNewPassword ? <Eye /> : <EyeOff />}
						</button>
					}
					onChange={(e) => setNewPassword(e.target.value)}
					required
					disabled={loading}
					className="max-w-xs"
				/>

				<Button type="submit" isLoading={loading}>
					Update Password
				</Button>
			</Form>
		</div>
	);
}
