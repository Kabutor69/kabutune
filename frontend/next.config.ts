import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
