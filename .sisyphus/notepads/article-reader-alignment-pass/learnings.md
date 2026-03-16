# Learnings: Article Reader Alignment Pass

## Conventions & Patterns

(To be populated as tasks complete)

## Code Patterns

(To be populated as tasks complete)

## Task 1: 404 Triptych Hero Translation

### Implementation Pattern
- Replaced centered poster layout with three-zone flex layout (flex-row h-screen)
- Left zone: Repeated slug text (Array.from 5x) at top and bottom-third positions
- Center zone: ProximityLink navigation, date, excerpt with vertical black borders
- Right zone: Oversized stroked asterisk (text-[1280px] text-stroke) behind title

### Color Deployment
- Klein (#0048ff): Left zone bottom quarter background
- Magenta (#ff00a6): Center zone top-right block (w-1/2 h-1/3)
- Acid (#c3ff00): Right zone title background (extends above viewport)
- All three colors now structurally present vs Phase 1 acid-only

### Component Upgrades
- Replaced Link with ProximityLink for navigation (large-link class)
- Removed StretchEntrance (unused after triptych conversion)
- Preserved SimpleEntrance with staggered delays (0-1200ms range)
- Maintained all data-reader-* landmarks

### Typography & Spacing
- Stroked glyph: text-[1280px] font-medium font-serif text-stroke
- Repeated text: font-mono large-p (text-2xl)
- Navigation: large-link (text-5xl)
- Zone gaps: gap-6 between flex columns, p-6 container padding

### Verification
- lsp_diagnostics: Clean
- npm run lint: Pass
- npm run build: Pass (7 static pages generated)
