import path from "node:path"
import { defineConfig } from "vite-plus"

export default defineConfig({
  check: {
    fmt: true,
    lint: true
  },
  fmt: {
    printWidth: 80,
    sortTailwindcss: {
      stylesheet: "./src/app/global.css"
    },
    semi: false,
    trailingComma: "none",
    ignorePatterns: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "pnpm-lock.yaml",
      "next-env.d.ts",
      "src/generated/**",
      "public/banners/**"
    ]
  },
  lint: {
    options: {
      typeAware: true
    },
    plugins: [
      "typescript",
      "react",
      "jsx-a11y",
      "nextjs",
      "import",
      "unicorn",
      "oxc"
    ],
    ignorePatterns: [
      ".next/**",
      ".vercel/**",
      "out/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      "next-env.d.ts",
      "src/generated/**",
      "public/banners/**"
    ]
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    passWithNoTests: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  staged: {
    "*.{ts,tsx,js,jsx,mjs}": "vp check --fix",
    "*.{json,css}": "vp fmt --write"
  }
})
