export type FalloffMode = "linear" | "exponential" | "gaussian"

export interface AxisRange {
  axis: string
  fromValue: number
  toValue: number
}

export interface ProximityShadowTuning {
  hoverEnterLerp: number
  hoverLeaveLerp: number
  falloffExponent: number
  maxOffset: number
  maxOffsetXOnly: number
  maxOffsetReverse: number
  directionSoftness: number
  innerDeadZone: number
  offsetEnterLerp: number
  offsetLeaveLerp: number
  visibilityThreshold: number
  wghtBoost: number
  wghtMaxExtra: number
}

export interface ShadowOffset {
  x: number
  y: number
}

export const defaultShadowTuning: ProximityShadowTuning = {
  hoverEnterLerp: 0.12,
  hoverLeaveLerp: 0.2,
  falloffExponent: 0.75,
  maxOffset: 24,
  maxOffsetXOnly: 28,
  maxOffsetReverse: 28,
  directionSoftness: 8,
  innerDeadZone: 8,
  offsetEnterLerp: 0.16,
  offsetLeaveLerp: 0.24,
  visibilityThreshold: 0.08,
  wghtBoost: 200,
  wghtMaxExtra: 400
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function parseVariationSettings(settingsStr: string) {
  return new Map(
    settingsStr
      .split(",")
      .map((item) => item.trim())
      .map((item) => {
        const [rawAxis, rawValue] = item.split(/\s+/)
        return [rawAxis.replace(/['"]/g, ""), parseFloat(rawValue)] as const
      })
      .filter(([, value]) => Number.isFinite(value))
  )
}

// Quantizing falloff/strength into discrete steps lets us cache the generated
// font-variation-settings strings. A step is 1/200 of the axis range (e.g. 3
// weight units for wght 300-900), far below the perceptible threshold, so the
// output is visually identical to full-precision interpolation.
const SETTINGS_STEPS = 200

export interface VariationSettingsCache {
  baseFor(falloffValue: number): string
  shadowFor(falloffValue: number, shadowStrength: number): string
}

function formatAxes(
  parsedSettings: AxisRange[],
  t: number,
  wghtBoost: number,
  axisMin: number,
  axisMax: number
): string {
  let result = ""
  for (let i = 0; i < parsedSettings.length; i++) {
    const { axis, fromValue, toValue } = parsedSettings[i]
    let value = fromValue + (toValue - fromValue) * t
    if (wghtBoost !== 0 && axis === "wght") {
      value = clamp(value + wghtBoost, axisMin, axisMax)
    }
    value = Math.round(value * 100) / 100
    result += `${i === 0 ? "" : ", "}'${axis}' ${value}`
  }
  return result
}

export function createVariationSettingsCache(
  parsedSettings: AxisRange[],
  wghtAxisRange: AxisRange | undefined,
  allowShadowYFollow: boolean,
  tuning: ProximityShadowTuning
): VariationSettingsCache {
  const baseCache: (string | undefined)[] = Array.from({
    length: SETTINGS_STEPS + 1
  })
  const baseFor = (falloffValue: number): string => {
    const step = Math.round(clamp(falloffValue, 0, 1) * SETTINGS_STEPS)
    return (baseCache[step] ??= formatAxes(
      parsedSettings,
      step / SETTINGS_STEPS,
      0,
      0,
      0
    ))
  }

  if (!allowShadowYFollow || !wghtAxisRange) {
    // In X-only mode shadow and base axis settings are identical.
    return { baseFor, shadowFor: baseFor }
  }

  const axisMin = Math.min(wghtAxisRange.fromValue, wghtAxisRange.toValue)
  const axisMax =
    Math.max(wghtAxisRange.fromValue, wghtAxisRange.toValue) +
    tuning.wghtMaxExtra
  const shadowCache = new Map<number, string>()
  const shadowFor = (falloffValue: number, shadowStrength: number): string => {
    const falloffStep = Math.round(clamp(falloffValue, 0, 1) * SETTINGS_STEPS)
    const strengthStep = Math.round(
      clamp(shadowStrength, 0, 1) * SETTINGS_STEPS
    )
    const key = falloffStep * (SETTINGS_STEPS + 1) + strengthStep
    let cached = shadowCache.get(key)
    if (cached === undefined) {
      cached = formatAxes(
        parsedSettings,
        falloffStep / SETTINGS_STEPS,
        tuning.wghtBoost * (strengthStep / SETTINGS_STEPS),
        axisMin,
        axisMax
      )
      shadowCache.set(key, cached)
    }
    return cached
  }

  return { baseFor, shadowFor }
}

export function getFalloffValue(
  distance: number,
  radius: number,
  falloff: FalloffMode
) {
  // Normalize distance into [0, 1] where 1 means "right under the cursor".
  // This gives all falloff curves a shared visual baseline.
  const norm = clamp(1 - distance / radius, 0, 1)
  switch (falloff) {
    case "exponential":
      // Pulls most intensity close to the center for a tighter hotspot.
      return norm ** 2
    case "gaussian":
      // Produces a soft bell-shaped halo that fades smoothly at the edges.
      return Math.exp(-((distance / (radius / 2)) ** 2) / 2)
    case "linear":
    default:
      // Keeps influence proportional to distance for the most direct feel.
      return norm
  }
}

export interface ShadowOffsetResult {
  x: number
  y: number
  visible: boolean
}

export type ShadowOffsetComputer = (
  deltaX: number,
  deltaY: number,
  distance: number,
  shadowStrength: number,
  hoverProgress: number,
  isHovered: boolean,
  previousOffset: ShadowOffset,
  out: ShadowOffsetResult
) => void

export function createShadowOffsetComputer({
  radius,
  allowShadowYFollow,
  reverseDirection,
  reverseNearStronger,
  shadowTuning
}: {
  radius: number
  allowShadowYFollow: boolean
  reverseDirection: boolean
  reverseNearStronger: boolean
  shadowTuning: ProximityShadowTuning
}): ShadowOffsetComputer {
  // Different interaction modes can have different perceived travel,
  // so each mode gets its own max offset control.
  const activeMaxOffset = reverseDirection
    ? shadowTuning.maxOffsetReverse
    : allowShadowYFollow
      ? shadowTuning.maxOffset
      : shadowTuning.maxOffsetXOnly
  const innerDeadZone = shadowTuning.innerDeadZone
  const innerRadiusRange = Math.max(radius - innerDeadZone, 1)
  const deadZoneRange = Math.max(innerDeadZone, 1)
  // Reverse-near mode multiplies two curves, which can inflate magnitude.
  // This normalization keeps the perceived travel comparable to normal mode.
  const exponent = Math.max(shadowTuning.falloffExponent, 0.0001)
  const reverseNearNormalization =
    Math.pow(exponent, exponent) / Math.pow(exponent + 1, exponent + 1)
  // directionSoftness acts like a denominator floor, making close-range motion
  // less twitchy while preserving directionality.
  const softnessSquared =
    shadowTuning.directionSoftness * shadowTuning.directionSoftness
  const directionMultiplier = reverseDirection ? -1 : 1
  const visibilityThresholdSquared =
    shadowTuning.visibilityThreshold * shadowTuning.visibilityThreshold

  return (
    deltaX,
    deltaY,
    distance,
    shadowStrength,
    hoverProgress,
    isHovered,
    previousOffset,
    out
  ) => {
    // shadowStrength already includes falloff + hover progress. Multiplying by
    // max offset converts that normalized strength into screen-space pixels.
    const shadowDistance = activeMaxOffset * shadowStrength

    // Dead zone keeps the center stable and avoids jitter when cursor sits
    // exactly over a glyph.
    const distanceRamp = clamp(
      (distance - innerDeadZone) / innerRadiusRange,
      0,
      1
    )

    // Fade in smoothly right after leaving the dead zone to prevent a hard
    // jump.
    const deadZoneExitRamp = clamp(
      (distance - innerDeadZone) / deadZoneRange,
      0,
      1
    )

    const offsetRamp = reverseDirection
      ? distance <= innerDeadZone
        ? 0
        : reverseNearStronger
          ? (1 - distanceRamp) * deadZoneExitRamp * reverseNearNormalization
          : distanceRamp
      : distanceRamp
    const directionScale =
      shadowDistance /
      Math.sqrt(deltaX * deltaX + deltaY * deltaY + softnessSquared)

    const targetOffsetX =
      deltaX * directionScale * offsetRamp * directionMultiplier
    const targetOffsetY = allowShadowYFollow
      ? deltaY * directionScale * offsetRamp * directionMultiplier
      : 0
    const offsetLerp = isHovered
      ? shadowTuning.offsetEnterLerp
      : shadowTuning.offsetLeaveLerp

    // Exponential smoothing gives motion inertia without needing springs.
    const x = previousOffset.x + (targetOffsetX - previousOffset.x) * offsetLerp
    const y = previousOffset.y + (targetOffsetY - previousOffset.y) * offsetLerp

    out.x = x
    out.y = y
    out.visible =
      hoverProgress > 0.01 && x * x + y * y > visibilityThresholdSquared
  }
}
