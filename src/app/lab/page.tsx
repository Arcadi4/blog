import type { Metadata } from "next"
import { ArticleCallout } from "@/components/article/ArticleCallout"
import { ArticleCodeFigure } from "@/components/article/ArticleCodeFigure"
import { ArticleFigure } from "@/components/article/ArticleFigure"
import { ArticleFold } from "@/components/article/ArticleFold"
import { ArticleInterruption } from "@/components/article/ArticleInterruption"
import { ArticlePullQuote } from "@/components/article/ArticlePullQuote"
import { SiteGrid } from "@/components/layout/SiteGrid"
import { ArchiveMatrix } from "@/components/signal/ArchiveMatrix"
import type { ArchiveMatrixItem } from "@/components/signal/ArchiveMatrix"
import { EvidenceScan } from "@/components/signal/EvidenceScan"
import { SegmentedRing } from "@/components/signal/SegmentedRing"
import { SignalAction } from "@/components/signal/SignalAction"
import { SignalBars } from "@/components/signal/SignalBars"
import { SignalRedaction } from "@/components/signal/SignalRedaction"
import styles from "./DesignLab.module.css"

export const metadata: Metadata = {
  title: "Visual Signal Lab · @4rcadia",
  description:
    "A development surface for the blog's Swiss editorial signal system."
}

const matrixItems: readonly ArchiveMatrixItem[] = [
  {
    coordinate: [1, 2],
    id: "notes",
    meta: "Writing / long form / active",
    title: "Field Notes",
    tone: "acid"
  },
  {
    coordinate: [4, 4],
    id: "builds",
    meta: "Code / systems / indexed",
    title: "Build Logs",
    tone: "klein"
  },
  {
    coordinate: [7, 2],
    id: "graphics",
    meta: "Design / image / volatile",
    title: "Graphic Tests",
    tone: "magenta"
  },
  {
    coordinate: [9, 5],
    id: "games",
    meta: "Play / observation / open",
    title: "Game Studies",
    tone: "acid"
  },
  {
    coordinate: [11, 3],
    id: "fragments",
    meta: "Short form / uncategorized",
    title: "Fragments",
    tone: "klein"
  }
]

const processorCode = `const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkDirective)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeShikiFromHighlighter, highlighter)`

const sectionTitleClass =
  "font-funnel-display text-[clamp(3.4rem,7.5vw,6rem)] leading-[0.72] tracking-[-0.06em] uppercase"

function Artifact({ signal = false }: { readonly signal?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.artifact} ${signal ? styles.artifactSignal : ""}`}
    >
      <span className={styles.artifactWindow} />
      <span className={styles.artifactCode}>{signal ? "X17" : "A17"}</span>
      <span className={styles.artifactTicks} />
    </span>
  )
}

export default function DesignLabPage() {
  return (
    <main className="bg-background text-foreground" lang="en">
      <SiteGrid>
        <header
          className={`${styles.heroField} relative col-span-full grid min-h-[54rem] grid-cols-subgrid overflow-hidden border-b border-foreground`}
        >
          <div className="col-span-2 flex flex-col justify-between bg-klein p-4 text-background">
            <span className="font-mono text-xs leading-none tracking-[0.18em] uppercase">
              Internal surface
            </span>
            <SegmentedRing
              className="size-32 self-center"
              label="Visual system revision one"
              ringClassName="text-acid"
              ringWidth={10}
            >
              <span aria-hidden="true" className="font-mono text-sm">
                V/01
              </span>
            </SegmentedRing>
            <span className="font-mono text-[10px] leading-tight uppercase">
              Stable grid
              <br />
              unstable signal
            </span>
          </div>

          <div className="col-span-8 col-start-3 grid grid-cols-subgrid grid-rows-[min-content_1fr_min-content] py-4">
            <div className="col-span-full flex items-start justify-between font-mono text-xs leading-none tracking-[0.16em] uppercase">
              <span>Design lab / not in primary navigation</span>
              <span>2026 / system 01</span>
            </div>

            <h1 className="col-span-full self-center font-funnel-display text-[clamp(6rem,12vw,13rem)] leading-[0.68] tracking-[-0.07em] uppercase">
              Visual
              <br />
              <span className="text-klein">Signal</span>
              <br />
              System
            </h1>

            <div className="col-span-full grid grid-cols-subgrid border-t border-foreground pt-4">
              <p className="col-span-4 max-w-xl text-lg leading-tight">
                Swiss editorial order interrupted by brief diagnostic events.
                Saturation is information; motion is a state change; metadata is
                always real.
              </p>
              <SignalBars className="col-span-4 w-full self-end" />
            </div>
          </div>

          <aside className="col-span-2 col-start-11 grid grid-rows-3">
            <div className="flex items-end justify-between bg-acid p-4">
              <span className="font-mono text-[10px] uppercase">Acid</span>
              <span className="font-funnel-display text-5xl leading-none">
                A
              </span>
            </div>
            <div className="flex items-end justify-between bg-magenta p-4">
              <span className="font-mono text-[10px] uppercase">Magenta</span>
              <span className="font-funnel-display text-5xl leading-none">
                M
              </span>
            </div>
            <div className="flex items-end justify-between bg-foreground p-4 text-background">
              <span className="font-mono text-[10px] uppercase">Carbon</span>
              <span className="font-funnel-display text-5xl leading-none">
                C
              </span>
            </div>
          </aside>
        </header>

        <section className="col-span-full mt-40 grid min-h-64 grid-cols-subgrid overflow-hidden border-y border-foreground">
          <div className="col-span-2 flex flex-col justify-between bg-foreground p-4 text-background">
            <span className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
              Authoring status
            </span>
            <span className="font-funnel-display text-6xl leading-[0.75]">
              Inert
            </span>
          </div>
          <div className="col-span-8 col-start-3 flex flex-col justify-center py-8">
            <h2 className="font-funnel-display text-5xl leading-[0.82] tracking-[-0.04em]">
              Directive-ready, not parser-wired.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-tight">
              The current build deliberately removes directive nodes and stores
              sanitized HTML. These examples define visual and content contracts
              only. A future AST-to-React renderer can adopt them without
              allowing arbitrary MDX or breaking the article grid.
            </p>
          </div>
          <div className="col-span-2 col-start-11 flex items-center justify-center bg-acid p-4 text-foreground">
            <span className="font-mono text-xs leading-none tracking-[0.16em] uppercase [writing-mode:vertical-rl]">
              Proposed / allowlisted
            </span>
          </div>
        </section>

        <section
          aria-labelledby="redaction-title"
          className="col-span-full mt-40 grid min-h-80 grid-cols-subgrid overflow-hidden border-y border-foreground"
        >
          <div className="col-span-2 flex flex-col justify-between bg-foreground p-4 text-background">
            <span className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
              Instrument / I-01
            </span>
            <span className="font-funnel-display text-8xl leading-[0.7]">
              R
            </span>
          </div>
          <div className="col-span-8 col-start-3 flex flex-col justify-between py-8">
            <div>
              <h2
                className="font-funnel-display text-6xl leading-[0.78] tracking-[-0.04em] uppercase"
                id="redaction-title"
              >
                Signal Redaction
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-tight">
                One string in; one memorable behavior out. Hover or focus gives
                a temporary double-image preview. Activation pins the reveal for
                touch and keyboard readers.
              </p>
            </div>
            <p className="mt-14 font-funnel-display text-[clamp(2.5rem,5vw,5.5rem)] leading-[0.82] tracking-[-0.04em]">
              The unstable variable is{" "}
              <SignalRedaction>human attention</SignalRedaction>.
            </p>
          </div>
          <div className="col-span-2 col-start-11 flex flex-col justify-between bg-acid p-4">
            <code className="font-mono text-[10px] leading-tight break-all uppercase">
              :arc-redact[human attention]
            </code>
            <span className="font-mono text-[10px] leading-none uppercase [writing-mode:vertical-rl]">
              Hover / focus / pin
            </span>
          </div>
        </section>

        <section
          aria-labelledby="matrix-title"
          className="col-span-full grid grid-cols-subgrid pt-40"
        >
          <div className="col-span-full grid grid-cols-subgrid pb-8">
            <p className="col-span-2 font-mono text-xs leading-none tracking-[0.16em] uppercase">
              Component / C-01
            </p>
            <div className="col-span-8 col-start-3">
              <h2 className={sectionTitleClass} id="matrix-title">
                Archive Matrix
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-tight">
                A spatial index for tags, years, projects, or article clusters.
                It is keyboard-operable and turns selection into a focused color
                field instead of a conventional popover.
              </p>
            </div>
          </div>
          <ArchiveMatrix items={matrixItems} />
        </section>

        <section
          aria-labelledby="figure-title"
          className="col-span-full grid grid-cols-subgrid pt-40"
        >
          <div className="col-span-full grid grid-cols-subgrid pb-8">
            <p className="col-span-2 font-mono text-xs leading-none tracking-[0.16em] uppercase">
              Article block / A-01
            </p>
            <div className="col-span-8 col-start-3">
              <h2 className={sectionTitleClass} id="figure-title">
                Article Figure
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-tight">
                A media breakout for images, diagrams, video stills, or
                interactive evidence. The future directive supplies the media;
                the component owns alignment and caption hierarchy.
              </p>
            </div>
            <pre className="col-span-8 col-start-3 mt-6 overflow-hidden bg-foreground p-3 font-mono text-[10px] leading-tight whitespace-pre-wrap text-acid">
              {`:::arc-figure{#A17 credit="CSS study"}\n...media...\n:::`}
            </pre>
          </div>
          <ArticleFigure
            caption="A synthetic object used to prove the figure frame without coupling it to a particular image component."
            credit="CSS study / design lab"
            figureId="A17"
          >
            <EvidenceScan
              base={<Artifact />}
              className="w-[min(90%,38rem)]"
              label="Compare the stable artifact with its diagnostic signal layer"
              signal={<Artifact signal />}
            />
          </ArticleFigure>
        </section>

        <section
          aria-labelledby="callout-title"
          className="col-span-full grid grid-cols-subgrid pt-40"
        >
          <div className="col-span-full grid grid-cols-subgrid pb-8">
            <p className="col-span-2 font-mono text-xs leading-none tracking-[0.16em] uppercase">
              Article block / A-02
            </p>
            <div className="col-span-8 col-start-3">
              <h2 className={sectionTitleClass} id="callout-title">
                Article Callout
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-tight">
                A compact semantic interruption for caveats, definitions, and
                context that deserves more structure than a blockquote.
              </p>
            </div>
            <pre className="col-span-8 col-start-3 mt-6 overflow-hidden bg-foreground p-3 font-mono text-[10px] leading-tight whitespace-pre-wrap text-acid">
              {`:::arc-callout{label="Constraint" title="The grid is shared"}\n...body...\n:::`}
            </pre>
          </div>
          <ArticleCallout label="Constraint" title="One physical grid">
            The article renderer may change, but layout blocks must inherit the
            same twelve tracks as the page around them. A component never
            invents a near-enough grid for convenience.
          </ArticleCallout>
        </section>

        <section
          aria-labelledby="fold-title"
          className="col-span-full grid grid-cols-subgrid pt-40"
        >
          <div className="col-span-full grid grid-cols-subgrid pb-8">
            <p className="col-span-2 font-mono text-xs leading-none tracking-[0.16em] uppercase">
              Article block / A-03
            </p>
            <div className="col-span-8 col-start-3">
              <h2 className={sectionTitleClass} id="fold-title">
                Article Fold
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-tight">
                Optional derivations, transcripts, and implementation notes use
                the browser&apos;s native disclosure behavior while the shutter
                inherits all twelve page tracks.
              </p>
            </div>
            <pre className="col-span-8 col-start-3 mt-6 overflow-hidden bg-foreground p-3 font-mono text-[10px] leading-tight whitespace-pre-wrap text-acid">
              {`:::arc-fold{summary="Open the implementation note"}\n...optional reading...\n:::`}
            </pre>
          </div>
          <ArticleFold summary="Open the implementation note">
            <p>
              This is intentionally a native details element. The component
              contributes visual identity and grid placement without replacing a
              durable browser interaction with an accordion framework.
            </p>
            <p className="mt-5">
              It is also a clean normalization target for Notion details blocks
              if the article pipeline later moves from HTML strings to an
              allowlisted document tree.
            </p>
          </ArticleFold>
        </section>

        <section
          aria-labelledby="quote-title"
          className="col-span-full grid grid-cols-subgrid pt-40"
        >
          <div className="col-span-full grid grid-cols-subgrid pb-8">
            <p className="col-span-2 font-mono text-xs leading-none tracking-[0.16em] uppercase">
              Article block / A-04
            </p>
            <div className="col-span-8 col-start-3">
              <h2 className={sectionTitleClass} id="quote-title">
                Article Pull Quote
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-tight">
                A full-width pause in long-form reading. It keeps citation data
                explicit and uses scale as editorial structure, not decoration.
              </p>
            </div>
            <pre className="col-span-8 col-start-3 mt-6 overflow-hidden bg-foreground p-3 font-mono text-[10px] leading-tight whitespace-pre-wrap text-acid">
              {`:::arc-quote{citation="System principle"}\nThe grid stays calm...\n:::`}
            </pre>
          </div>
          <ArticlePullQuote citation="Visual system principle / revision 01">
            The grid stays calm so the signal can afford to be violent.
          </ArticlePullQuote>
        </section>

        <section
          aria-labelledby="interruption-title"
          className="col-span-full grid grid-cols-subgrid pt-40"
        >
          <div className="col-span-full grid grid-cols-subgrid pb-8">
            <p className="col-span-2 font-mono text-xs leading-none tracking-[0.16em] uppercase">
              Article block / A-05
            </p>
            <div className="col-span-8 col-start-3">
              <h2 className={sectionTitleClass} id="interruption-title">
                Article Interruption
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-tight">
                A rare, aggressive chapter break. Use it once in a long article
                when the argument changes state—not as a general-purpose card.
              </p>
            </div>
            <pre className="col-span-8 col-start-3 mt-6 overflow-hidden bg-foreground p-3 font-mono text-[10px] leading-tight whitespace-pre-wrap text-acid">
              {`:::arc-interruption{index="05" title="State change"}\n...bridge...\n:::`}
            </pre>
          </div>
          <ArticleInterruption index="05" title="State change">
            Long-form typography remains quiet on either side. The rupture is
            powerful because it is scarce, brief, and tied to the argument.
          </ArticleInterruption>
        </section>

        <section
          aria-labelledby="code-title"
          className="col-span-full grid grid-cols-subgrid pt-40"
        >
          <div className="col-span-full grid grid-cols-subgrid pb-8">
            <p className="col-span-2 font-mono text-xs leading-none tracking-[0.16em] uppercase">
              Article block / A-06
            </p>
            <div className="col-span-8 col-start-3">
              <h2 className={sectionTitleClass} id="code-title">
                Code Figure
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-tight">
                A captioned frame around the Shiki output already produced at
                build time. The language belongs to the fenced code block, so
                the directive does not duplicate it as an attribute.
              </p>
            </div>
            <pre className="col-span-8 col-start-3 mt-6 overflow-hidden bg-foreground p-3 font-mono text-[10px] leading-tight whitespace-pre-wrap text-acid">
              {`:::arc-code{filename="pipeline.ts" caption="Build transform"}\n\u0060\u0060\u0060ts\n...\n\u0060\u0060\u0060\n:::`}
            </pre>
          </div>
          <ArticleCodeFigure
            caption="A build-time transform stays server-rendered and safe to cache."
            copyValue={processorCode}
            filename="article-document.ts"
          >
            <pre className="m-0 bg-transparent p-0 text-background">
              <code>{processorCode}</code>
            </pre>
          </ArticleCodeFigure>
        </section>

        <section
          aria-labelledby="action-title"
          className="col-span-full grid grid-cols-subgrid pt-40 pb-24"
        >
          <div className="col-span-full grid grid-cols-subgrid pb-8">
            <p className="col-span-2 font-mono text-xs leading-none tracking-[0.16em] uppercase">
              Composition / X-01
            </p>
            <div className="col-span-8 col-start-3">
              <h2 className={sectionTitleClass} id="action-title">
                Signal Action
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-tight">
                The established proximity shade remains completely absent at
                rest, then resolves into a double image only while the label is
                hovered.
              </p>
            </div>
            <pre className="col-span-8 col-start-3 mt-6 overflow-hidden bg-foreground p-3 font-mono text-[10px] leading-tight whitespace-pre-wrap text-acid">
              {`::arc-action[Return home]{href="/" index="07"}`}
            </pre>
          </div>
          <SignalAction
            description="Leave the experimental surface and return to the live homepage."
            eyebrow="Navigation / stable"
            href="/"
            index="07"
            label="Return / Home"
          />
        </section>
      </SiteGrid>
    </main>
  )
}
