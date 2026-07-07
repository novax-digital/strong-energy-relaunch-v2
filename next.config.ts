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
        source: "/produkte",
        destination: "/de/produkte",
        permanent: true
      },
      {
        source: "/produkte/:path*",
        destination: "/de/produkte/:path*",
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
        source: "/faq",
        destination: "/de/faq",
        permanent: true
      },
      {
        source: "/360-app",
        destination: "/de/360-app",
        permanent: true
      },
      {
        source: "/impressum",
        destination: "/de/impressum",
        permanent: true
      },
      {
        source: "/agb",
        destination: "/de/agb",
        permanent: true
      },
      {
        source: "/datenschutz",
        destination: "/de/datenschutz",
        permanent: true
      },
      {
        source: "/garantiebedingungen",
        destination: "/de/garantiebedingungen",
        permanent: true
      },
      {
        source: "/rechtliche-hinweise",
        destination: "/de/rechtliche-hinweise",
        permanent: true
      },
      {
        source: "/gpsr",
        destination: "/de/gpsr",
        permanent: true
      },
      {
        source: "/cookie-richtlinie",
        destination: "/de/cookie-richtlinie",
        permanent: true
      },
      {
        source: "/blog",
        destination: "/de/blog",
        permanent: true
      },
      {
        source: "/blog/:path*",
        destination: "/de/blog/:path*",
        permanent: true
      },
      {
        source: "/download/:slug",
        destination: "/de/downloads?item=:slug",
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
