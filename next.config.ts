import type { NextConfig } from "next";

/**
 * GitHub Pages serves this repo at https://<user>.github.io/poroweb/, so every
 * URL needs the /poroweb prefix. The workflow sets NEXT_PUBLIC_BASE_PATH; it is
 * empty locally, so `npm run dev` still serves from the root.
 *
 * Exported as NEXT_PUBLIC_* on purpose — components need it too, for asset URLs
 * that Next does not rewrite (a raw <video src>, unlike next/image or Link).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export — Pages has no Node server.
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  // The export has no image optimiser to call at runtime.
  images: { unoptimized: true },
  // Emit /path/index.html rather than /path.html, which Pages resolves cleanly.
  trailingSlash: true,
};

export default nextConfig;
