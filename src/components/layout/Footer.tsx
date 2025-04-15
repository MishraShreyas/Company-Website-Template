export const Footer = () => {
	return (
		<footer className="w-full text-center text-sm text-white py-6 bg-black border-t">
			<div className="max-w-screen-md mx-auto px-4 flex flex-col gap-2">
				<p className="font-mono">VISIT AGAIN SOON</p>
				<p className="text-gray-400">
					<span className="text-cyan-400">[Your Studio Name]</span>
				</p>
				<div className="flex justify-center space-x-4">
					<a href="#" className="text-pink-400 hover:text-pink-200">
						Twitter
					</a>
					<a href="#" className="text-cyan-400 hover:text-cyan-200">
						Discord
					</a>
					<a
						href="#"
						className="text-yellow-400 hover:text-yellow-200"
					>
						GitHub
					</a>
				</div>
				<p className="mt-2 text-gray-600 text-xs">
					2025 &copy; Your Studio Name. All rights reserved.
				</p>
			</div>
		</footer>
	);
};
