import type { Metadata } from "next"
import type { ReactNode } from "react"
import { ArticleCallout } from "@/components/article/ArticleCallout"
import { ArticleCodeFigure } from "@/components/article/ArticleCodeFigure"
import { ArticleContents } from "@/components/article/ArticleContents"
import { ArticleDivider } from "@/components/article/ArticleDivider"
import { ArticleFactGrid } from "@/components/article/ArticleFactGrid"
import { ArticleFigure } from "@/components/article/ArticleFigure"
import { ArticleFold } from "@/components/article/ArticleFold"
import { ArticleLead } from "@/components/article/ArticleLead"
import { ArticleMarginNote } from "@/components/article/ArticleMarginNote"
import { ArticleProse } from "@/components/article/ArticleProse"
import { ArticlePullQuote } from "@/components/article/ArticlePullQuote"
import { ArticleReferences } from "@/components/article/ArticleReferences"
import { SiteGrid } from "@/components/layout/SiteGrid"
import { PageContactSheet } from "@/components/page/PageContactSheet"
import type { PageContactSheetItem } from "@/components/page/PageContactSheet"
import { PageFactSheet } from "@/components/page/PageFactSheet"
import { PageFeatureFigure } from "@/components/page/PageFeatureFigure"
import { PageIndexRow } from "@/components/page/PageIndexRow"
import { PageInterruption } from "@/components/page/PageInterruption"
import { PageMasthead } from "@/components/page/PageMasthead"
import { PagePullQuote } from "@/components/page/PagePullQuote"
import { PageSectionIntro } from "@/components/page/PageSectionIntro"
import { PageSignalAction } from "@/components/page/PageSignalAction"
import { PageTypeField } from "@/components/page/PageTypeField"
import { ArchiveMatrix } from "@/components/signal/ArchiveMatrix"
import type { ArchiveMatrixItem } from "@/components/signal/ArchiveMatrix"
import { EvidenceScan } from "@/components/signal/EvidenceScan"
import { SegmentedRing } from "@/components/signal/SegmentedRing"
import { SignalBars } from "@/components/signal/SignalBars"
import { SignalDotField } from "@/components/signal/SignalDotField"
import { SignalRedaction } from "@/components/signal/SignalRedaction"
import styles from "./DesignLab.module.css"

export const metadata: Metadata = {
  title: "Component Field Manual · @4rcadia",
  description:
    "A development surface for the blog's page, article, and signal systems."
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

const processorCode = `const document = await compileArticle(source)

return renderArticle({
  document,
  directives: allowlistedDirectives
})`

const contactSheetItems: readonly PageContactSheetItem[] = [
  {
    className: "col-span-5",
    href: "/",
    id: "01",
    media: (
      <div
        aria-hidden="true"
        className={`${styles.sheetMedia} ${styles.sheetMediaAcid}`}
      >
        <span>12</span>
      </div>
    ),
    meta: "Grid study / CSS / 2026",
    title: "Measured field"
  },
  {
    className: "col-span-3 col-start-6",
    id: "02",
    media: (
      <SignalDotField
        className={`${styles.sheetMedia} ${styles.sheetMediaKlein}`}
      >
        <span aria-hidden="true" className={styles.sheetDotMark}>
          +
        </span>
      </SignalDotField>
    ),
    meta: "Signal substrate / decorative",
    title: "Blue register"
  },
  {
    className: "col-span-4 col-start-9",
    id: "03",
    media: (
      <div
        aria-hidden="true"
        className={`${styles.sheetMedia} ${styles.sheetMediaPaper}`}
      >
        <span>TYPE</span>
      </div>
    ),
    meta: "Type crop / editorial",
    title: "Off-frame language"
  },
  {
    className: "col-span-8 col-start-3",
    href: "/",
    id: "04",
    media: (
      <div
        aria-hidden="true"
        className={`${styles.sheetMedia} ${styles.sheetMediaMono}`}
      >
        <span>ARCHIVE / 004</span>
      </div>
    ),
    meta: "Index feature / authored placement",
    title: "One wide exception"
  }
]

const articleContentsItems = [
  { href: "#reader-method", label: "Reader method" },
  { href: "#semantic-surface", label: "Semantic surface" },
  { href: "#exit-condition", label: "Exit condition" }
] as const

type LabSpecProps = {
  readonly children: ReactNode
  readonly directive?: string
  readonly index: string
  readonly name: string
}

function LabSpec({ children, directive, index, name }: LabSpecProps) {
  return (
    <div className="col-span-full grid grid-cols-subgrid border-t border-foreground/35 py-4">
      <p className="col-span-2 font-mono text-[10px] leading-none tracking-[0.14em] uppercase max-md:col-span-3">
        Component / {index}
      </p>
      <div className="col-span-6 col-start-3 max-md:col-span-9 max-md:col-start-4">
        <h3 className="font-funnel-display text-3xl leading-none tracking-[-0.03em]">
          {name}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/70">
          {children}
        </p>
      </div>
      <code className="col-span-2 col-start-11 self-start font-mono text-[10px] leading-tight break-all text-klein max-md:col-span-9 max-md:col-start-4 max-md:row-start-2 max-md:mt-3">
        {directive ?? "React composition only"}
      </code>
    </div>
  )
}

function Artifact({ signal = false }: { readonly signal?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.artifact} ${signal ? styles.artifactSignal : ""}`}
    >
      <span className={styles.artifactMeta}>
        <span>Form / 017</span>
        <span>12 × 08</span>
      </span>
      <span className={styles.artifactWindow} />
      <span className={styles.artifactFooter}>
        <span className={styles.artifactTicks} />
        <span className={styles.artifactCode}>{signal ? "X17" : "A17"}</span>
      </span>
    </span>
  )
}

export default function LabPage() {
  return (
    <main className="overflow-x-clip bg-background text-foreground" lang="en">
      <SiteGrid>
        <PageMasthead
          eyebrow="Component field manual"
          sequence="V2"
          summary={
            <>
              Two levels, one grid. Page components can perform; article
              components protect the reading rhythm. Signal primitives supply
              brief interaction and decoration to either when the content earns
              it.
            </>
          }
          title={
            <>
              Design
              <br />
              <span className="text-klein">by use</span>
            </>
          }
        >
          <div className="w-[min(82%,22rem)]">
            <Artifact />
          </div>
        </PageMasthead>

        <section className="col-span-full mt-32 grid grid-cols-subgrid">
          <PageSectionIntro
            index="01"
            label="Expressive layer"
            title="Pages can perform"
          >
            Use these on routes whose layout is itself authored: Home, About,
            All Articles, project indexes, and occasional visual essays. Their
            size is intentional and should not leak into routine post bodies.
          </PageSectionIntro>

          <LabSpec index="P-01" name="PageMasthead">
            Opens a unique page with one dominant idea, a summary, and an
            optional visual. The top of this lab is the live specimen.
          </LabSpec>

          <LabSpec index="P-02" name="PageSectionIntro">
            Introduces a major chapter on an authored page. It standardizes
            hierarchy without deciding what the section contains.
          </LabSpec>

          <LabSpec index="P-03" name="PageIndexRow">
            Builds article archives and project indexes. The title uses the
            proximity double image; metadata stays quiet and scannable.
          </LabSpec>

          <div className="col-span-full grid grid-cols-subgrid border-b border-foreground">
            <PageIndexRow
              href="/"
              index="001"
              meta="Essay / 08 min"
              summary="A long-form field note about systems that stay legible under pressure."
              title="Order / under signal"
            />
            <PageIndexRow
              href="/"
              index="002"
              meta="Build / 14 min"
              summary="How a strict grid creates room for unpredictable interactions."
              title="Twelve columns"
            />
          </div>

          <LabSpec index="P-04" name="PageFeatureFigure">
            Gives a landing page one large image, animation, video still, or
            interactive visual with explicit caption and credit ownership.
          </LabSpec>

          <PageFeatureFigure
            caption="The diagnostic layer is revealed only while scanning or after it is pinned."
            credit="CSS study / lab"
            figureId="A17"
          >
            <EvidenceScan
              base={<Artifact />}
              className="w-[min(90%,38rem)]"
              label="Compare the stable artifact with its diagnostic signal layer"
              signal={<Artifact signal />}
            />
          </PageFeatureFigure>

          <LabSpec index="P-05" name="PagePullQuote">
            Reserves manifesto-scale quotation for About pages and visual
            essays. Ordinary article quotations use the quieter article block.
          </LabSpec>

          <PagePullQuote citation="Field manual / separation principle">
            Expressive pages announce a world. Articles let a thought unfold.
          </PagePullQuote>

          <LabSpec index="P-06" name="PageInterruption">
            Marks a real state change in a long visual page. It is deliberately
            too strong for normal Markdown rendering.
          </LabSpec>

          <PageInterruption index="02" title="Protect the reading rhythm">
            The ordinary article layer uses less color, less motion, and a
            narrower measure. Its identity comes from exact typography and
            small, meaningful signals.
          </PageInterruption>

          <LabSpec index="P-07" name="PageTypeField">
            Turns one short phrase into the composition for a campaign, visual
            essay, or rare About-page moment. It is a poster surface, never an
            article heading.
          </LabSpec>

          <PageTypeField
            details={[
              "Output / authored",
              "Field / 12 columns",
              "Frequency / rare"
            ]}
            eyebrow="Typography as image"
            index="07"
            summary="The crop is intentional, while the summary, details, and media remain ordinary semantic content on the shared grid."
            title="Type is space"
          >
            <SignalDotField
              className="h-full min-h-48 bg-foreground text-acid"
              label="Twelve-column calibration mark"
            >
              <span aria-hidden="true" className={styles.typeFieldMark}>
                12
              </span>
            </SignalDotField>
          </PageTypeField>

          <LabSpec index="P-08" name="PageContactSheet">
            Makes a portfolio, project archive, or image-led index where media
            is the primary navigation. Each item owns a real title and caption;
            explicit grid classes author exceptional placement without a
            coordinate API.
          </LabSpec>

          <PageContactSheet
            items={contactSheetItems}
            label="Selected records"
            title="Contact / field"
          />

          <LabSpec index="P-09" name="PageFactSheet">
            Structures an About page, CV, contributor profile, or project
            dossier. The visual slot is optional; the facts remain a semantic
            definition list when the poster treatment is removed.
          </LabSpec>

          <PageFactSheet
            eyebrow="Profile dossier"
            facts={[
              { label: "Role", value: "Designer / engineer" },
              { label: "Base", value: "New York / remote" },
              { label: "Focus", value: "Systems / language" },
              { label: "Status", value: "Independent" }
            ]}
            lede="A factual, modular identity surface for pages that need more structure than a biography paragraph and less theater than a masthead."
            title={
              <>
                Skylar
                <br />
                Arcadia
              </>
            }
            year="2026"
          >
            <div aria-hidden="true" className={styles.factPortrait}>
              <span>SK</span>
              <small>Profile / 01</small>
            </div>
          </PageFactSheet>
        </section>

        <section className="col-span-full mt-32 grid grid-cols-subgrid">
          <PageSectionIntro
            index="02"
            label="Reading layer"
            title="Articles stay useful"
          >
            These blocks correspond to recurring authoring needs and remain
            within the article measure. Their proposed <code>arc-*</code>
            directives document a future allowlist; the current HTML pipeline is
            intentionally unchanged.
          </PageSectionIntro>

          <LabSpec
            directive=":arc-lead[...opening thesis...]"
            index="A-01"
            name="ArticleLead"
          >
            States the thesis once at the beginning of a post. It is larger than
            body text but still belongs to the reading column.
          </LabSpec>
          <ArticleLead>
            A reusable article system should make common writing clearer, not
            turn every paragraph into a poster.
          </ArticleLead>

          <LabSpec index="A-02" name="ArticleProse">
            Provides the same reading styles as the current sanitized HTML
            renderer for a future allowlisted React document tree.
          </LabSpec>
          <ArticleProse>
            <h2>Typography carries the article</h2>
            <p>
              Regular paragraphs keep a stable measure, generous line height,
              and familiar HTML semantics. Links remain visible, code remains
              copyable, and headings create the strongest rhythm in the body.
            </p>
            <p>
              Components enter only when the author has a concrete need that
              ordinary Markdown cannot express well. The rest remains prose.
            </p>
            <ul>
              <li>Use semantic HTML before a directive.</li>
              <li>Keep metadata factual and concise.</li>
              <li>Spend vivid color on meaning.</li>
            </ul>
          </ArticleProse>

          <LabSpec
            directive=':::arc-callout{label="Constraint" title="One physical grid"}'
            index="A-03"
            name="ArticleCallout"
          >
            Holds a caveat, definition, or constraint that deserves structure
            but should not interrupt the argument like a feature panel.
          </LabSpec>
          <ArticleCallout label="Constraint" title="One physical grid">
            Every block inherits the site&apos;s twelve tracks. Article
            components narrow themselves inside that field instead of creating a
            second, almost-matching layout.
          </ArticleCallout>

          <LabSpec
            directive=':::arc-margin-note{label="Context"}'
            index="A-04"
            name="ArticleMarginNote"
          >
            Places a short aside, correction, or source note in the outer rail
            so supporting context remains visibly secondary.
          </LabSpec>
          <ArticleMarginNote label="Context">
            Margin notes should be brief. Longer detours belong in a fold or a
            separate section.
          </ArticleMarginNote>

          <LabSpec
            directive=':::arc-quote{citation="Source"}'
            index="A-05"
            name="ArticlePullQuote"
          >
            Emphasizes a sentence inside long-form reading without taking over
            the viewport or introducing a new color field.
          </LabSpec>
          <ArticlePullQuote citation="Article system / editorial rule">
            A useful component is memorable in the author&apos;s hand and quiet
            in the reader&apos;s way.
          </ArticlePullQuote>

          <LabSpec
            directive=':::arc-figure{#F01 credit="CSS study"}'
            index="A-06"
            name="ArticleFigure"
          >
            Renders a normal image, diagram, or video still at reading width
            with a durable figure number, caption, and optional credit.
          </LabSpec>
          <ArticleFigure
            caption="A static specimen proves the calmer figure frame. Interactive media is possible, but not assumed."
            credit="CSS study"
            figureId="F01"
          >
            <div className="flex min-h-[28rem] items-center justify-center p-12">
              <div className="w-[min(88%,32rem)]">
                <Artifact />
              </div>
            </div>
          </ArticleFigure>

          <LabSpec
            directive=':::arc-fold{summary="Implementation note"}'
            index="A-07"
            name="ArticleFold"
          >
            Hides optional derivations, transcripts, and implementation detail
            behind the browser&apos;s native disclosure behavior.
          </LabSpec>
          <ArticleFold summary="Open the implementation note">
            <p>
              This remains a native details element. The component contributes
              hierarchy and a small double-image response without replacing a
              durable browser interaction.
            </p>
          </ArticleFold>

          <LabSpec
            directive=':::arc-code{filename="article-document.ts"}'
            index="A-08"
            name="ArticleCodeFigure"
          >
            Frames an existing highlighted code block with filename, copy
            action, and caption. It owns the single horizontal scroll region.
          </LabSpec>
          <ArticleCodeFigure
            caption="An allowlisted document renderer can stay server-rendered."
            copyValue={processorCode}
            filename="article-document.ts"
          >
            <pre className="m-0 bg-transparent p-0 text-background">
              <code>{processorCode}</code>
            </pre>
          </ArticleCodeFigure>

          <LabSpec
            directive='::arc-divider[Implementation]{index="03"}'
            index="A-09"
            name="ArticleDivider"
          >
            Separates chapters when a heading alone is not enough, without the
            scale and saturation of a page interruption.
          </LabSpec>
          <ArticleDivider index="03" label="Implementation" />

          <LabSpec
            directive=":::arc-contents"
            index="A-10"
            name="ArticleContents"
          >
            Adds a visible outline only when a long post has at least three
            meaningful sections. It uses ordinary hash links, so it remains
            useful without client JavaScript.
          </LabSpec>
          <ArticleContents items={articleContentsItems} />
          <ArticleProse>
            <h2 id="reader-method">Reader method</h2>
            <p>
              The outline previews the argument instead of reproducing every
              heading. A reader can scan the route, enter at the useful point,
              and keep browser-native navigation.
            </p>
            <h2 id="semantic-surface">Semantic surface</h2>
            <p>
              The component is a navigation landmark containing a numbered list.
              Its visual system is editorial; its structure is ordinary web
              content.
            </p>
            <h2 id="exit-condition">Exit condition</h2>
            <p>
              Short posts omit it. A contents panel with only one or two links
              adds chrome without improving orientation.
            </p>
          </ArticleProse>

          <LabSpec
            directive=':::arc-facts{label="Build context"}'
            index="A-11"
            name="ArticleFactGrid"
          >
            Summarizes versions, scope, status, or measured results near the
            start of a technical post. It is for factual context, not a row of
            marketing metrics.
          </LabSpec>
          <ArticleFactGrid
            facts={[
              { label: "Grid", value: "12 columns" },
              { label: "Runtime", value: "Server first" },
              { label: "Status", value: "Field test" }
            ]}
            label="Build context"
          />

          <LabSpec
            directive=':::arc-references{title="Sources"}'
            index="A-12"
            name="ArticleReferences"
          >
            Gives citations and further reading consistent end-matter hierarchy
            while leaving each source as ordinary authored content.
          </LabSpec>
          <ArticleReferences title="Sources and further reading">
            <ol>
              <li>
                Müller-Brockmann, <cite>Grid Systems in Graphic Design</cite>.
              </li>
              <li>Project notes on the shared twelve-column site field.</li>
              <li>
                Interaction studies derived from the ProximityLink sample.
              </li>
            </ol>
          </ArticleReferences>
        </section>

        <section className="col-span-full mt-32 grid grid-cols-subgrid">
          <PageSectionIntro
            index="03"
            label="Signal layer"
            title="Small moments stay strange"
          >
            Signal components either communicate a transient state or exist as
            declared decoration. They are ingredients, not layout policy.
          </PageSectionIntro>

          <LabSpec index="S-01" name="SignalRedaction">
            Reveals spoilers, withheld terms, or answers on hover/focus and can
            be pinned for touch. It is presentational, never a security
            boundary.
          </LabSpec>
          <p className="col-span-8 col-start-3 py-10 font-funnel-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.88] tracking-[-0.04em]">
            The unstable variable is{" "}
            <SignalRedaction>human attention</SignalRedaction>.
          </p>

          <LabSpec index="S-02" name="ArchiveMatrix">
            A keyboard-operable spatial selector for archives, tags, years, or
            project clusters on index pages.
          </LabSpec>
          <ArchiveMatrix items={matrixItems} />

          <LabSpec index="S-03" name="SignalBars + SegmentedRing">
            Purely aesthetic calibration marks. They add visual cadence and may
            be hidden from assistive technology unless a real label is supplied.
          </LabSpec>
          <div className="col-span-8 col-start-3 grid min-h-52 grid-cols-8 items-center border-y border-foreground">
            <SignalBars className="col-span-5" />
            <SegmentedRing
              className="col-span-2 col-start-7 size-32 justify-self-end"
              label="Visual system revision two"
              ringClassName="text-klein"
            >
              <span aria-hidden="true" className="font-mono text-sm">
                V/02
              </span>
            </SegmentedRing>
          </div>

          <LabSpec index="S-04" name="SignalDotField">
            Supplies a quiet dotted registration field behind a logo, icon, or
            single object. It is decorative by default and becomes a labeled
            image only when the composition itself carries meaning.
          </LabSpec>
          <SignalDotField
            className="col-span-8 col-start-3 min-h-[30rem] bg-klein text-background max-md:col-span-full max-md:col-start-1"
            label="Twelve-column registration field"
          >
            <span aria-hidden="true" className={styles.dotFieldMark}>
              12
            </span>
          </SignalDotField>

          <LabSpec index="P-10" name="PageSignalAction">
            Closes an expressive page with one high-priority destination. Its
            ProximityLink shade is absent at rest and appears only on hover.
          </LabSpec>
          <PageSignalAction
            className="mb-24"
            description="Leave the internal field manual and return to the live homepage."
            eyebrow="Navigation / stable"
            href="/"
            index="10"
            label="Return / Home"
          />
        </section>
      </SiteGrid>
    </main>
  )
}
