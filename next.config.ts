import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker deployment
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  cacheComponents: true,
  turbopack: {
    root: path.dirname(__filename),
  },
  // Experimental features for faster builds
  experimental: {
    optimizePackageImports: ["@radix-ui", "lucide-react"],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    return config;
  },
};

export default nextConfig;
