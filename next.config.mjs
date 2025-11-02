/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  devIndicators: {
    buildActivity: false
  },
  // Add the allowed origin for Firebase Studio preview
  allowedDevOrigins: ['6000-firebase-studio-1761826878404.cluster-lu4mup47g5gm4rtyvhzpwbfadi.cloudworkstations.dev']
};

export default nextConfig;
