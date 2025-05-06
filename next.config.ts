Add-Content -Path "next.config.js" @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // Add any image domains you were using
  },
  // Add any other configurations from your previous setup
}

module.exports = nextConfig
"@