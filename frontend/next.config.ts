import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@distube/ytdl-core'],
  images: {
    domains: [
      'img.youtube.com', 
      'i.ytimg.com', 
      'yt3.ggpht.com',
      'lh3.googleusercontent.com',
      'ytimg.com'
    ],
  },
  output: 'standalone',
};

export default nextConfig;
