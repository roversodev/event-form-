import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['ferf1mheo22r9ira.public.blob.vercel-storage.com', 'nqjhakjqagqhietnttqq.supabase.co', 'lh3.googleusercontent.com']
  }
};

export default nextConfig;
