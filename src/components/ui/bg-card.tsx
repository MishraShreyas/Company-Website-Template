"use client";

interface BGCardProps {
	image: string;
	title: string;
	description: string;
	link?: string;
}

export function BGCard({ image, title, description, link }: BGCardProps) {
	const Wrapper = link ? "a" : "div";
	const wrapperProps = link
		? { href: link, target: "_blank", rel: "noreferrer" }
		: {};

	return (
		<Wrapper {...wrapperProps} className="w-full group/card">
			<div
				className="cursor-pointer overflow-hidden relative card min-h-124 h-full w-full rounded-md shadow-xl mx-auto backgroundImage flex flex-col justify-between p-4 bg-cover bg-center bg-neutral-700/50 dark:bg-transparent"
				style={{
					backgroundImage: `url(${image})`,
				}}
			>
				<div className="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-65% via-transparent to-purple-950/50"></div>
				<div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
				<div className="flex flex-row items-center space-x-4 z-10">
					{/* <Image
						height="100"
						width="100"
						alt="Avatar"
						src="/manu.png"
						className="h-10 w-10 rounded-full border-2 object-cover"
					/>
					<div className="flex flex-col">
						<p className="font-normal text-2xl text-gray-50 relative z-10">
							Manu Arora
						</p>
						<p className="text-sm text-gray-400">2 min read</p>
					</div> */}
				</div>
				<div className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
					<h1 className="font-bold text-xl md:text-3xl text-gray-50 relative z-10">
						{title}
					</h1>
					<p className="font-medium text-lg text-gray-50 relative z-10">
						{description}
					</p>
				</div>
			</div>
		</Wrapper>
	);
}
