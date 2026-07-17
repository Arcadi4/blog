export function NoiseOverlay() {
  return (
    <figure
      className="pointer-events-none fixed inset-0 z-100 opacity-20 mix-blend-screen filter-[url('#noise-bg-fx')_grayscale(100%)]"
      aria-hidden="true"
    >
      <svg>
        <filter id="noise-bg-fx">
          <feTurbulence baseFrequency="0.8" />
        </filter>
      </svg>
    </figure>
  )
}
