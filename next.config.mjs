/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "quixotic-rabbit-261.convex.cloud",
        pathname: "/api/storage/**", // Match the correct path pattern for your images
      },
    ],
  },
};

export default nextConfig;
