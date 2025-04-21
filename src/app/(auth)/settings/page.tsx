"use client";
import { motion } from "motion/react";

export default function Page() {
	return (
		<div className="flex flex-col gap-4">
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
		</div>
	);
}
