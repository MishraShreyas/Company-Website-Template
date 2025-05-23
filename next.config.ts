import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	rewrites: async () => {
		return [
			{
				source: "/projects",
				destination: "/",
			},
		];
	},
};

export default nextConfig;
