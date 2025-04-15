"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { BackgroundBeamsWithCollision } from "@/components/ui/beams";
import GlitchImage from "@/components/ui/glitch-image";
import { HoverCard } from "@/components/ui/hover-card";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useEffect } from "react";
import { addToast } from "@heroui/react";
import { title } from "process";
import { FeaturesSectionDemo } from "@/components/ui/features";
import { Footer } from "@/components/layout/Footer";
import ArcadeButton from "@/components/ui/arcade-button";
import { BGCard } from "@/components/ui/bg-card";

export default function Page() {
	const aboutUsWords = [
		{
			text: "Join",
		},
		{
			text: "Our",
		},
		{
			text: "Team",
		},
		{
			text: "at",
		},
		{
			text: "Obelithe.",
			className:
				"bg-gradient-to-r from-indigo-500 to-purple-500 inline-block text-transparent dark:text-transparent bg-clip-text",
		},
	];

	return (
		<div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
			<BackgroundBeamsWithCollision>
				<div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
					<div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
				</div>
				<div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
					<div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
				</div>
				<div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
					<div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
				</div>
				<div className="px-4 py-10 md:py-20">
					<h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
						{"An Indie Game Studio based in India"
							.split(" ")
							.map((word, index) => (
								<motion.span
									key={index}
									initial={{
										opacity: 0,
										filter: "blur(4px)",
										y: 10,
									}}
									animate={{
										opacity: 1,
										filter: "blur(0px)",
										y: 0,
									}}
									transition={{
										duration: 0.3,
										delay: index * 0.1,
										ease: "easeInOut",
									}}
									className="mr-2 inline-block"
								>
									{word}
								</motion.span>
							))}
					</h1>
					<motion.p
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
						transition={{
							duration: 0.3,
							delay: 0.8,
						}}
						className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
					>
						Currently Working on a Horror Experience
					</motion.p>
					<motion.div
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
						transition={{
							duration: 0.3,
							delay: 1,
						}}
						className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
					>
						<a
							href="https://shreyas-mishra.itch.io/tactical-troops"
							target="_blank"
							rel="noopener noreferrer"
						>
							<ArcadeButton>Check it out</ArcadeButton>
						</a>
					</motion.div>
					<motion.div
						initial={{
							opacity: 0,
							y: 10,
						}}
						animate={{
							opacity: 1,
							y: 0,
						}}
						transition={{
							duration: 0.3,
							delay: 1.2,
						}}
						className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
							<GlitchImage
								src="TacTroops.png"
								alt="Landing page preview"
								className="h-full w-full m-auto"
							/>
						</div>
					</motion.div>
				</div>
			</BackgroundBeamsWithCollision>

			{/* Features section */}
			<motion.section
				id="features"
				initial={{
					opacity: 0,
					y: 10,
				}}
				animate={{
					opacity: 1,
					y: 0,
				}}
				transition={{
					duration: 0.3,
					delay: 1.2,
				}}
				className="relative z-10 mt-20 w-full rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
			>
				<FeaturesSectionDemo />
			</motion.section>

			{/* Join us section*/}
			<motion.section
				id="join-us"
				initial={{
					opacity: 0,
					y: 10,
				}}
				animate={{
					opacity: 1,
					y: 0,
				}}
				transition={{
					duration: 0.3,
					delay: 1.2,
				}}
				className="relative z-10 my-20 w-full rounded-3xl border border-neutral-200 bg-neutral-100 p-8 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
			>
				<div className="w-full flex flex-col justify-center items-center">
					<TypewriterEffectSmooth words={aboutUsWords} />
					<a href="/careers">
						<ArcadeButton>Join Us</ArcadeButton>
					</a>
				</div>
				<div className="grid grid-cols-3 gap-10 mt-10 pb-5">
					<BGCard
						title="Ashank"
						image="/Ash_Pic.jpg"
						description="CEO, Project Manager"
						link="https://www.linkedin.com/in/ashank-rajput/"
					/>
					<BGCard
						title="Shreyas"
						image="/Shreyas_Pic.jpeg"
						description="CTO, Lead Developer"
						link="https://www.linkedin.com/in/ashank-rajput/"
					/>
					<BGCard
						title="???"
						image="/question-mark.png"
						description="Lead Artist"
					/>
				</div>
			</motion.section>

			<Footer />
		</div>
	);
}
