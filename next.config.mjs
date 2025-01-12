/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: 'images.pexels.com' },
			{ hostname: 'img.clerk.com' },
			{ hostname: 'res.cloudinary.com' },
		],
	},
};

export default nextConfig;
