import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Force the project root to this folder to avoid parent inference
    root: process.cwd(),
    // Ensure Tailwind resolves from local node_modules if a parent workspace is detected
    resolveAlias: {
      tailwindcss: path.join(process.cwd(), "node_modules", "tailwindcss"),
      "@tailwindcss/postcss": path.join(process.cwd(), "node_modules", "@tailwindcss", "postcss"),
    },
  },
};

export default nextConfig;
