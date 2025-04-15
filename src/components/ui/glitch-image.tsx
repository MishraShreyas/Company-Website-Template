import React from "react";
import { motion } from "framer-motion";

interface GlitchImageProps {
	src: string;
	alt: string;
	className?: string;
}

const GlitchImage = ({ src, alt, className = "" }: GlitchImageProps) => {
	return (
		<div className={`relative inline-block overflow-hidden ${className}`}>
			{/* Base image */}
			<motion.img
				src={src}
				alt={alt}
				className="w-full h-auto"
				initial={{ x: 0 }}
				animate={{ x: [0, -2, 2, -1, 1, 0] }}
				transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
			/>

			{/* Glitch overlays */}
			<motion.img
				src={src}
				alt={alt}
				className="absolute top-0 left-0 w-full h-auto opacity-50 mix-blend-screen text-pink-500"
				style={{ filter: "drop-shadow(2px 0 pink)" }}
				initial={{ x: 0 }}
				animate={{ x: [0, 3, -3, 1, -1, 0] }}
				transition={{
					duration: 0.15,
					repeat: Infinity,
					repeatDelay: 4,
				}}
			/>

			<motion.img
				src={src}
				alt={alt}
				className="absolute top-0 left-0 w-full h-auto opacity-50 mix-blend-screen text-cyan-500"
				style={{ filter: "drop-shadow(-2px 0 cyan)" }}
				initial={{ x: 0 }}
				animate={{ x: [0, -3, 3, -1, 1, 0] }}
				transition={{
					duration: 0.18,
					repeat: Infinity,
					repeatDelay: 5,
				}}
			/>
		</div>
	);
};

export default GlitchImage;
