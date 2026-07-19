import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Raíz → español (idioma original del sitio).
      { source: "/", destination: "/es", permanent: false },
      // URLs pre-i18n ya indexadas → su equivalente en español.
      { source: "/ruta", destination: "/es/ruta", permanent: true },
      { source: "/donar", destination: "/es/donar", permanent: true },
      { source: "/cert/:path*", destination: "/es/cert/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
