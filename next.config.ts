import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No modifications to existing API routes or backend logic
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  },
};

export default nextConfig;
