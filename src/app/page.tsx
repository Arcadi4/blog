import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default function Home() {
  const posts = getSortedPostsData();
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="landing min-h-screen">
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:pt-16">
        <section className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/70 p-8 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.6)] backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
          <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-emerald-300/40 blur-3xl dark:bg-emerald-500/20" />
          <div className="absolute -bottom-20 right-6 h-72 w-72 rounded-full bg-amber-300/40 blur-3xl dark:bg-amber-400/20" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-50/80 px-4 py-1 text-sm font-medium uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                Notes, essays, experiments
              </p>
              <h1 className="text-balance font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-100">
                Crafting crisp web experiences with a dash of wonder.
              </h1>
              <p className="max-w-xl text-pretty text-lg text-slate-600 dark:text-slate-300">
                I share design systems, engineering patterns, and behind-the-scenes sketches that turn ideas into memorable products.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#latest"
                  className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                >
                  Explore the blog
                  <span className="text-lg transition group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-200"
                >
                  About the author
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 pt-2 text-sm text-slate-500 dark:text-slate-400">
                <div>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">120+</p>
                  <p>Design fragments</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">40+</p>
                  <p>Engineering notes</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">12</p>
                  <p>Product launches</p>
                </div>
              </div>
            </div>
            <div className="relative grid gap-6">
              <div className="glow-ring" />
              <div className="hero-grid">
                <div className="card-float">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                    Weekly Signal
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Micro-essays on interaction design, performance, and story.
                  </p>
                  <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-700/60">
                    <div className="h-full w-3/4 bg-emerald-500/70" />
                  </div>
                </div>
                <div className="card-float delay-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
                    Project Radar
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Field notes from current product builds and prototypes.
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <span className="h-10 rounded-xl bg-amber-200/80 dark:bg-amber-500/20" />
                    <span className="h-10 rounded-xl bg-emerald-200/80 dark:bg-emerald-500/20" />
                    <span className="h-10 rounded-xl bg-slate-200/80 dark:bg-slate-700/40" />
                  </div>
                </div>
                <div className="card-float delay-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">
                    Studio List
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    A curated list of the best tools, palettes, and rituals.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-sky-200/80 dark:bg-sky-500/20" />
                    <span className="h-10 w-10 rounded-full bg-emerald-200/80 dark:bg-emerald-500/20" />
                    <span className="h-10 w-10 rounded-full bg-amber-200/80 dark:bg-amber-500/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="latest" className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Signature themes
              </p>
              <h2 className="font-display text-3xl font-semibold text-slate-900 dark:text-slate-100">
                Where the craft lives
              </h2>
            </div>
            <p className="max-w-xl text-pretty text-slate-600 dark:text-slate-300">
              Expect a blend of research, product strategy, and tactile interface work that keeps teams shipping with confidence.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Systems with personality",
                body: "Frameworks that scale while staying playful and human.",
              },
              {
                title: "Performance stories",
                body: "Experiments that make speed, resilience, and polish measurable.",
              },
              {
                title: "Narrative UX",
                body: "Flow design that helps products feel intuitive at first glance.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
              >
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-3 text-slate-600 dark:text-slate-300">{item.body}</p>
                <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-sky-400 opacity-70" />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Latest dispatches
              </p>
              <h2 className="font-display text-3xl font-semibold text-slate-900 dark:text-slate-100">
                Fresh from the notebook
              </h2>
            </div>
            <Link
              href="#latest"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-300"
            >
              View all posts
              <span>→</span>
            </Link>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  {formatDate(post.date)}
                </p>
                <Link href={`/posts/${post.slug}`}>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-900 transition group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-300">
                    {post.title}
                  </h3>
                </Link>
                {post.excerpt && (
                  <p className="mt-3 text-slate-600 dark:text-slate-300">
                    {post.excerpt}
                  </p>
                )}
                <Link
                  href={`/posts/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:gap-3 dark:text-emerald-300"
                >
                  Read more
                  <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
