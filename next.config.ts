import type { NextConfig } from "next";
import path from "node:path";

// The glass UI lives under /glass; the domain root serves the dashboard
// from the herin-os project. Root-level rewrites (/, /api/*, /llms.txt,
// legacy asset paths) are handled at the platform layer in vercel.json.
const nextConfig: NextConfig = {
  // Stray package.json/proxy.js in the home dir make Turbopack infer the
  // wrong workspace root; pin it to this project.
  turbopack: { root: path.join(__dirname) },
  basePath: "/glass",
};

export default nextConfig;
