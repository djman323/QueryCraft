import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to bundle these Node.js modules on the client side
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('sql.js');
    }

    return config;
  },
};

export default nextConfig;


