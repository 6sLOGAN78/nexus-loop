/** @type {import('next').NextConfig} */
const API_ORIGIN = process.env.API_ORIGIN || "http://127.0.0.1:8765";

const nextConfig = {
  async rewrites() {
    return [
      { source: "/report.json", destination: `${API_ORIGIN}/report.json` },
      { source: "/health", destination: `${API_ORIGIN}/health` },
      { source: "/decision", destination: `${API_ORIGIN}/decision` },
      { source: "/generate", destination: `${API_ORIGIN}/generate` },
      { source: "/signed-copy/:path*", destination: `${API_ORIGIN}/signed-copy/:path*` },
    ];
  },
};

module.exports = nextConfig;
