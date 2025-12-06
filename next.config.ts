import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["via.placeholder.com", "lh3.googleusercontent.com"],
  }
};

export default nextConfig;
