import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['ferf1mheo22r9ira.public.blob.vercel-storage.com', 'nqjhakjqagqhietnttqq.supabase.co']
  }
};

export default nextConfig;
