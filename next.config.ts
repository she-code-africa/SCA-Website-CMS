// //src/next.config.ts

import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactCompiler: false,
// };

// export default nextConfig;

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
