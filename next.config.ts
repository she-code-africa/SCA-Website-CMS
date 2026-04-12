// //src/next.config.ts

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactCompiler: false,
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  async rewrites() {
    return [
      {
        // This captures any request starting with /api/external
        source: "/api/external/:path*",
        // And redirects it to your Heroku backend
        destination: "https://rbac-be-0de7ff4ed1ef.herokuapp.com/api/:path*"
      }
    ];
  }
};

export default nextConfig;