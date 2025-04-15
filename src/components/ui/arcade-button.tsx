import React from "react";
import { motion } from "framer-motion";

interface ArcadeButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	className?: string;
}

const ArcadeButton = ({
	children,
	className = "",
	...props
}: ArcadeButtonProps) => {
	return (
		<motion.button
			className={`p-1 relative ${className}`}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				duration: 0.2,
				type: "spring",
				stiffness: 300,
				damping: 20,
			}}
			// {...props}
		>
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"
				animate={{
					boxShadow: [
						"0 0 2px 0 rgba(122, 0, 255, 0.5)",
						"0 0 8px 2px rgba(122, 0, 255, 0.7)",
						"0 0 2px 0 rgba(122, 0, 255, 0.5)",
					],
				}}
				transition={{
					duration: 1.5,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<div className="px-8 py-2 bg-black rounded-md relative group transition duration-200 text-white hover:bg-transparent">
				{children}
			</div>
		</motion.button>
	);
};

export default ArcadeButton;
