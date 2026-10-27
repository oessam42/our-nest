import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["cloudflare:workers"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "cloudflare:workers": "commonjs cloudflare:workers",
      });
    }
    return config;
  },
};

export default nextConfig;
