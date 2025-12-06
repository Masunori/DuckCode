import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: [
		'lynwood-loreless-consubstantially.ngrok-free.app', // exact host
		'*.ngrok-free.app',                                 // allow any ngrok-free subdomain
	]
};

export default nextConfig;
