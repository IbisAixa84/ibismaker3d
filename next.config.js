/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite que next/image cargue imágenes servidas por la API local y por Cloudinary.
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8080', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
