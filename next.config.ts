import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: "blog.arcadia.moe" }],
      headers: [
        {
          key: "Origin-Trial",
          value:
            "AosgvuTD3z8jPMie0dTWMjGJNKOo5N2xXVPEsgh376uEQasQPOkOhhoLemljT3N21Z88T/6uI5jameR5CkjtjgsAAABpeyJvcmlnaW4iOiJodHRwczovL2Jsb2cuYXJjYWRpYS5tb2U6NDQzIiwiZmVhdHVyZSI6IkhUTUxJbkNhbnZhcyIsImV4cGlyeSI6MTc5MjQ1NDQwMCwiaXNTdWJkb21haW4iOnRydWV9"
        }
      ]
    }
  ],
  experimental: {
    authInterrupts: true,
    useTypeScriptCli: true,
    optimizeCss: true,
    optimizeServerReact: true
  }
}

export default nextConfig
