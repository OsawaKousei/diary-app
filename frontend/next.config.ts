import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // serverActions を experimental の中に移動
    serverActions: {
      bodySizeLimit: "10mb", // デフォルトの1MBから10MBに増加
    },
    // 大きなペイロードの処理を改善
    largePageDataBytes: 10 * 1024 * 1024, // 10MB
  },
};

export default nextConfig;
