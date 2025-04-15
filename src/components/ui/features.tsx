import { cn } from "@/lib/utils";
import { IconBrandYoutubeFilled, IconGlobe } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function FeaturesSectionDemo() {
	const features = [
		{
			title: "Tactical Troops Gallery",
			description: "",
			skeleton: <SkeletonTwo />,
			className:
				"border-b col-span-1 lg:col-span-3 dark:border-neutral-800",
		},
		{
			title: "Tactical Troops Trailer",
			description:
				"Assemble your troops and lead them to victory through ten increasingly difficult battles, all while upgrading and powering up your troops with unique abilities and weapons.",
			skeleton: <SkeletonThree />,
			className: "col-span-1 lg:col-span-3 dark:border-neutral-800",
		},
	];
	return (
		<div className="relative z-20 py-10 max-w-7xl mx-auto">
			<div className="px-8">
				<h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
					About Us
				</h4>

				<p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
					Code, chaos, and creativity. Welcome to where your next
					favorite game begins.
				</p>
			</div>

			<div className="relative ">
				<div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
					{features.map((feature) => (
						<FeatureCard
							key={feature.title}
							className={feature.className}
						>
							<FeatureTitle>{feature.title}</FeatureTitle>
							<FeatureDescription>
								{feature.description}
							</FeatureDescription>
							<div className=" h-full w-full">
								{feature.skeleton}
							</div>
						</FeatureCard>
					))}
				</div>
			</div>
		</div>
	);
}

const FeatureCard = ({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
			{children}
		</div>
	);
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
	return (
		<p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
			{children}
		</p>
	);
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
	return (
		<p
			className={cn(
				"text-sm md:text-base  max-w-4xl text-left mx-auto",
				"text-neutral-500 text-center font-normal dark:text-neutral-300",
				"text-left max-w-sm mx-0 md:text-sm my-2"
			)}
		>
			{children}
		</p>
	);
};

export const SkeletonOne = () => {
	return (
		<div className="relative flex py-8 px-2 gap-10 h-full">
			<div className="w-full  p-5  mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
				<div className="flex flex-1 w-full h-full flex-col space-y-2  ">
					{/* TODO */}
					<Image
						src="globe.svg"
						alt="header"
						width={800}
						height={800}
						className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
					/>
				</div>
			</div>

			<div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
			<div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
		</div>
	);
};

export const SkeletonThree = () => {
	return (
		<Link
			href="https://youtu.be/oCM_6dhOBj4"
			target="__blank"
			className="relative flex gap-10 group/image"
		>
			<div className="w-full  mx-auto bg-transparent dark:bg-transparent group h-full">
				<div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
					{/* TODO */}
					<IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto " />
					<Image
						src="/TacTroopsYT.png"
						alt="header"
						width={1289}
						height={964}
						className="h-full w-full object-contain object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
					/>
				</div>
			</div>
		</Link>
	);
};

export const SkeletonTwo = () => {
	const images = [
		"/TacTroops.png",
		"/TacTroops (2).png",
		"/TacTroops (3).png",
		"/TacTroops (4).png",
		"/TacTroops (5).png",
		"/TacTroops (6).png",
	];

	const getRandomImages = () => {
		const shuffled = [...images].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, 4);
	};

	const imageVariants = {
		whileHover: {
			scale: 1.1,
			rotate: 0,
			zIndex: 100,
		},
		whileTap: {
			scale: 1.1,
			rotate: 0,
			zIndex: 100,
		},
	};
	return (
		<div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
			{/* TODO */}
			<div className="flex flex-row -ml-20">
				{getRandomImages().map((image, idx) => (
					<motion.div
						variants={imageVariants}
						key={"images-first" + idx}
						style={{
							rotate: Math.random() * 20 - 10,
						}}
						whileHover="whileHover"
						whileTap="whileTap"
						className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
					>
						<Image
							src={image}
							alt="Tac troops images"
							width="1920"
							height="1080"
							className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
						/>
					</motion.div>
				))}
			</div>
			<div className="flex flex-row">
				{getRandomImages().map((image, idx) => (
					<motion.div
						key={"images-second" + idx}
						style={{
							rotate: Math.random() * 20 - 10,
						}}
						variants={imageVariants}
						whileHover="whileHover"
						whileTap="whileTap"
						className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
					>
						<Image
							src={image}
							alt="bali images"
							width="1920"
							height="1080"
							className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
						/>
					</motion.div>
				))}
			</div>

			<div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
			<div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
		</div>
	);
};

export const SkeletonFour = () => {
	return (
		<div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
			<IconGlobe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
		</div>
	);
};
