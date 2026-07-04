import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Stray package.json/proxy.js in the home dir make Turbopack infer the
  // wrong workspace root; pin it to this project.
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
