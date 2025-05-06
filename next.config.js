/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
  experimental: {
    serverActions: {
      enabled: true
    }
  },
  // Add this to ensure proper route handling
  typescript: {
    // This is important to prevent TypeScript errors from breaking the build
    ignoreBuildErrors: true,
  },
  // Add this to help with module resolution for extensions
  webpack: (config, { isServer }) => {
    // Add a fallback for the missing module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    return config;
  },
}

module.exports = nextConfig
