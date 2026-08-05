/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite que next/image cargue imágenes servidas por la API local.
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8080', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
