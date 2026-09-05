import type { NextConfig } from "next";

// Next.js's App Router injects inline <script> tags itself (RSC streaming /
// hydration payloads) — a strict `script-src 'self'` with no 'unsafe-inline'
// blocks the framework's own scripts, not just attacker-injected ones,
// breaking every page (confirmed: "Executing inline script violates CSP").
// The fully strict alternative is a nonce-based CSP, but that requires every
// page to be dynamically rendered (no static generation, no ISR) per Next's
// own docs — not worth it here since this app has no XSS injection vector to
// begin with (no dangerouslySetInnerHTML anywhere, nothing renders
// unescaped user content as HTML). This follows Next's own documented
// "Without Nonces" CSP pattern instead.
const isDev = process.env.NODE_ENV === "development";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`, // unsafe-eval: React dev-mode error reconstruction only, not used in production
  "style-src 'self' 'unsafe-inline'", // CodeMirror injects inline styles for syntax highlighting
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
