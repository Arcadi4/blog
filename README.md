# Personal Blog

A modern, clean personal blog built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📝 **Markdown Support** - Write blog posts in Markdown
- 🎨 **Beautiful Design** - Clean, responsive UI with dark mode support
- ⚡ **Fast Performance** - Static generation for optimal speed
- 🔍 **SEO Friendly** - Optimized metadata for search engines
- 📱 **Mobile Responsive** - Looks great on all devices
- 🎯 **TypeScript** - Type-safe development

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content**: Markdown with gray-matter and remark

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Arcadi4/blog.git
cd blog
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the blog.

## Project Structure

```
blog/
├── posts/              # Markdown blog posts
├── public/             # Static assets
├── src/
│   ├── app/           # Next.js app directory
│   │   ├── about/     # About page
│   │   ├── posts/     # Blog post pages
│   │   ├── layout.tsx # Root layout
│   │   └── page.tsx   # Home page
│   ├── components/    # React components
│   └── lib/           # Utility functions
└── package.json
```

## Adding Blog Posts

To add a new blog post:

1. Create a new `.md` file in the `posts` directory
2. Add frontmatter metadata at the top:

```markdown
---
title: "Your Post Title"
date: "2024-02-09"
excerpt: "A brief description of your post"
---

# Your Post Title

Your post content goes here...
```

3. The post will automatically appear on the homepage

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Customization

### Updating Site Information

Edit `src/app/layout.tsx` to update:
- Site title
- Meta description
- Other metadata

### Styling

- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.ts` (if needed)
- Component styles: Use Tailwind utility classes

### Adding Pages

Create new directories in `src/app/` following Next.js App Router conventions.

## Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and configure the build

### Other Platforms

You can also deploy to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Any platform that supports Node.js

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Markdown Guide](https://www.markdownguide.org/)

