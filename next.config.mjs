import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
  async rewrites() {
    return [
      { source: "/terms", destination: "/terms.html" },
      { source: "/privacy", destination: "/privacy.html" },
      { source: "/refund", destination: "/refund.html" },
      { source: "/contact", destination: "/contact.html" },
    ];
  },
  async redirects() {
    return [
      { source: "/app", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
