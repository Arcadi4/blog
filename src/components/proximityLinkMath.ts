export type FalloffMode = "linear" | "exponential" | "gaussian";

export interface AxisRange {
  axis: string;
  fromValue: number;
  toValue: number;
}

export interface ProximityShadowTuning {
  hoverEnterLerp: number;
  hoverLeaveLerp: number;
  falloffExponent: number;
  maxOffset: number;
  maxOffsetXOnly: number;
  maxOffsetReverse: number;
  directionSoftness: number;
  innerDeadZone: number;
  offsetEnterLerp: number;
  offsetLeaveLerp: number;
  visibilityThreshold: number;
  wghtBoost: number;
  wghtMaxExtra: number;
}

export interface ShadowOffset {
  x: number;
  y: number;
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
  wghtMaxExtra: 400,
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function parseVariationSettings(settingsStr: string) {
  return new Map(
    settingsStr
      .split(",")
      .map((item) => item.trim())
      .map((item) => {
        const [rawAxis, rawValue] = item.split(/\s+/);
        return [rawAxis.replace(/['"]/g, ""), parseFloat(rawValue)] as const;
      })
      .filter(([, value]) => Number.isFinite(value)),
  );
}

export function formatVariationSettings(
  settings: Array<{ axis: string; value: number }>,
) {
  return settings.map(({ axis, value }) => `'${axis}' ${value}`).join(", ");
}

export function getFalloffValue(
  distance: number,
  radius: number,
  falloff: FalloffMode,
) {
  // Normalize distance into [0, 1] where 1 means "right under the cursor".
  // This gives all falloff curves a shared visual baseline.
  const norm = clamp(1 - distance / radius, 0, 1);
  switch (falloff) {
    case "exponential":
      // Pulls most intensity close to the center for a tighter hotspot.
      return norm ** 2;
    case "gaussian":
      // Produces a soft bell-shaped halo that fades smoothly at the edges.
      return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
    case "linear":
    default:
      // Keeps influence proportional to distance for the most direct feel.
      return norm;
  }
}

export function buildLayerVariationSettings({
  parsedSettings,
  wghtAxisRange,
  falloffValue,
  allowShadowYFollow,
  shadowStrength,
  shadowTuning,
}: {
  parsedSettings: AxisRange[];
  wghtAxisRange?: AxisRange;
  falloffValue: number;
  allowShadowYFollow: boolean;
  shadowStrength: number;
  shadowTuning: ProximityShadowTuning;
}) {
  // Interpolate every axis for the base glyph so shape follows proximity.
  const interpolatedAxisValues = parsedSettings.map(
    ({ axis, fromValue, toValue }) => ({
      axis,
      value: fromValue + (toValue - fromValue) * falloffValue,
    }),
  );
  const baseSettings = formatVariationSettings(interpolatedAxisValues);

  if (!allowShadowYFollow || !wghtAxisRange) {
    // In X-only mode we keep shadow and base axis settings identical.
    return { baseSettings, shadowSettings: baseSettings };
  }

  const axisMin = Math.min(wghtAxisRange.fromValue, wghtAxisRange.toValue);
  const axisMax =
    Math.max(wghtAxisRange.fromValue, wghtAxisRange.toValue) +
    shadowTuning.wghtMaxExtra;
  const shadowSettings = formatVariationSettings(
    interpolatedAxisValues.map(({ axis, value }) => {
      if (axis !== "wght") return { axis, value };
      // Shadow gets extra weight to read as a denser layer under the text.
      const boostedValue = value + shadowTuning.wghtBoost * shadowStrength;
      return { axis, value: clamp(boostedValue, axisMin, axisMax) };
    }),
  );

  return { baseSettings, shadowSettings };
}

export function getShadowOffset({
  deltaX,
  deltaY,
  distance,
  radius,
  shadowStrength,
  hoverProgress,
  isHovered,
  allowShadowYFollow,
  reverseDirection,
  reverseNearStronger,
  previousOffset,
  shadowTuning,
}: {
  deltaX: number;
  deltaY: number;
  distance: number;
  radius: number;
  shadowStrength: number;
  hoverProgress: number;
  isHovered: boolean;
  allowShadowYFollow: boolean;
  reverseDirection: boolean;
  reverseNearStronger: boolean;
  previousOffset: ShadowOffset;
  shadowTuning: ProximityShadowTuning;
}) {
  // Different interaction modes can have different perceived travel,
  // so each mode gets its own max offset control.
  const activeMaxOffset = reverseDirection
    ? shadowTuning.maxOffsetReverse
    : allowShadowYFollow
      ? shadowTuning.maxOffset
      : shadowTuning.maxOffsetXOnly;

  // shadowStrength already includes falloff + hover progress. Multiplying by
  // max offset converts that normalized strength into screen-space pixels.
  const shadowDistance = activeMaxOffset * shadowStrength;

  // Dead zone keeps the center stable and avoids jitter when cursor sits
  // exactly over a glyph.
  const innerRadiusRange = Math.max(radius - shadowTuning.innerDeadZone, 1);
  const distanceRamp = clamp(
    (distance - shadowTuning.innerDeadZone) / innerRadiusRange,
    0,
    1,
  );

  // Fade in smoothly right after leaving the dead zone to prevent a hard jump.
  const deadZoneExitRamp = clamp(
    (distance - shadowTuning.innerDeadZone) /
      Math.max(shadowTuning.innerDeadZone, 1),
    0,
    1,
  );

  // Reverse-near mode multiplies two curves, which can inflate magnitude.
  // This normalization keeps the perceived travel comparable to normal mode.
  const exponent = Math.max(shadowTuning.falloffExponent, 0.0001);
  const reverseNearNormalization =
    Math.pow(exponent, exponent) / Math.pow(exponent + 1, exponent + 1);
  const offsetRamp = reverseDirection
    ? distance <= shadowTuning.innerDeadZone
      ? 0
      : reverseNearStronger
        ? (1 - distanceRamp) * deadZoneExitRamp * reverseNearNormalization
        : distanceRamp
    : distanceRamp;
  const directionScale =
    shadowDistance /
    Math.sqrt(
      deltaX * deltaX +
        deltaY * deltaY +
        shadowTuning.directionSoftness * shadowTuning.directionSoftness,
    );

  // directionSoftness acts like a denominator floor, making close-range motion
  // less twitchy while preserving directionality.
  const directionMultiplier = reverseDirection ? -1 : 1;

  const targetOffsetX =
    deltaX * directionScale * offsetRamp * directionMultiplier;
  const targetOffsetY = allowShadowYFollow
    ? deltaY * directionScale * offsetRamp * directionMultiplier
    : 0;
  const offsetLerp = isHovered
    ? shadowTuning.offsetEnterLerp
    : shadowTuning.offsetLeaveLerp;

  // Exponential smoothing gives motion inertia without needing spring physics.
  const x = previousOffset.x + (targetOffsetX - previousOffset.x) * offsetLerp;
  const y = previousOffset.y + (targetOffsetY - previousOffset.y) * offsetLerp;

  // Keep invisible shadow updates cheap when offset is visually negligible.
  const visible =
    hoverProgress > 0.01 && Math.hypot(x, y) > shadowTuning.visibilityThreshold;

  return { x, y, visible };
}
