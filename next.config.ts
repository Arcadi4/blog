import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    useTypeScriptCli: true,
    optimizeCss: true,
    optimizeServerReact: true,
  },
};

export default nextConfig;
