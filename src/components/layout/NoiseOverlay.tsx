export function NoiseOverlay() {
  return (
    <figure
      className="pointer-events-none fixed inset-0 z-1000 opacity-25 mix-blend-difference filter-[url('#noise-bg-fx')_grayscale(100%)]"
      aria-hidden="true"
    >
      <svg>
        <filter id="noise-bg-fx">
          <feTurbulence baseFrequency="0.67" />
        </filter>
      </svg>
    </figure>
  )
}
