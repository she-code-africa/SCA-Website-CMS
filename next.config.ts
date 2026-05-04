// //src/next.config.ts

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactCompiler: false,
// };

// export default nextConfig;

import type { NextConfig } from "next";

const getDestination = (baseUrl: string | undefined, path: string) => {
  if (!baseUrl) throw new Error(`Missing environment variable for ${path}`);
  // Ensure baseUrl starts with http:// or https://
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    throw new Error(
      `Invalid base URL: ${baseUrl}. Must start with http:// or https://`
    );
  }
  // Remove trailing slash if present
  const cleanUrl = baseUrl.replace(/\/$/, "");
  return `${cleanUrl}/${path}`;
};

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: false,
  async rewrites() {
    return [
      {
        source: "/api/external/:path*",
        destination: getDestination(process.env.NEXT_PUBLIC_BASE_URL, ":path*")
      },
      {
        source: "/api/stem/:path*",
        destination: getDestination(
          process.env.NEXT_PUBLIC_STEM_A_GIRL_BASE_URL,
          ":path*"
        )
      }
    ];
  }
};

export default nextConfig;