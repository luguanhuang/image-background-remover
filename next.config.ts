import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
};

// Keep local development stable by default.
// Only enable the Cloudflare/OpenNext dev bridge when explicitly requested.
if (process.env.ENABLE_CLOUDFLARE_DEV === "1") {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
