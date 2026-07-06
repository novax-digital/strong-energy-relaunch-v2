import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "strong-energy.eu"
      },
      {
        protocol: "https",
        hostname: "qyxshvsbovymfodqnvfq.supabase.co"
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org"
      },
      {
        protocol: "https",
        hostname: "developer.apple.com"
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/de",
        permanent: true
      },
      {
        source: "/produkte/:path*",
        destination: "/de/produkte",
        permanent: true
      },
      {
        source: "/ueber-uns",
        destination: "/de/ueber-uns",
        permanent: true
      },
      {
        source: "/kontakt",
        destination: "/de/kontakt",
        permanent: true
      },
      {
        source: "/partner",
        destination: "/de/partner",
        permanent: true
      },
      {
        source: "/blog/:path*",
        destination: "/de/blog",
        permanent: true
      },
      {
        source: "/downloads/:path*",
        destination: "/de/downloads",
        permanent: true
      },
      {
        source: "/media/:path*",
        destination: "/de/media",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
