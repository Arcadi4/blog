export const metadata = {
  title: 'About | My Personal Blog',
  description: 'Learn more about me and this blog',
};

export default function About() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
          About Me
        </h1>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6">
            Welcome to my personal blog! This is a space where I share my thoughts, 
            experiences, and knowledge about web development and technology.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">
            About This Blog
          </h2>
          
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            This blog is built with modern web technologies:
          </p>

          <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-300 mb-6 space-y-2">
            <li><strong>Next.js 16</strong> - React framework with App Router</li>
            <li><strong>TypeScript</strong> - Type-safe development</li>
            <li><strong>Tailwind CSS</strong> - Utility-first styling</li>
            <li><strong>Markdown</strong> - Simple content management</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">
            Get In Touch
          </h2>
          
          <p className="text-zinc-700 dark:text-zinc-300">
            Feel free to reach out if you&apos;d like to connect or collaborate on projects.
            You can find me on various platforms or drop me an email.
          </p>
        </div>
      </div>
    </div>
  );
}
