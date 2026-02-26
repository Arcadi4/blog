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
  maxOffsetXOnly: 30,
  maxOffsetReverse: 24,
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
  const norm = clamp(1 - distance / radius, 0, 1);
  switch (falloff) {
    case "exponential":
      return norm ** 2;
    case "gaussian":
      return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
    case "linear":
    default:
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
  const interpolatedAxisValues = parsedSettings.map(
    ({ axis, fromValue, toValue }) => ({
      axis,
      value: fromValue + (toValue - fromValue) * falloffValue,
    }),
  );
  const baseSettings = formatVariationSettings(interpolatedAxisValues);

  if (!allowShadowYFollow || !wghtAxisRange) {
    return { baseSettings, shadowSettings: baseSettings };
  }

  const axisMin = Math.min(wghtAxisRange.fromValue, wghtAxisRange.toValue);
  const axisMax =
    Math.max(wghtAxisRange.fromValue, wghtAxisRange.toValue) +
    shadowTuning.wghtMaxExtra;
  const shadowSettings = formatVariationSettings(
    interpolatedAxisValues.map(({ axis, value }) => {
      if (axis !== "wght") return { axis, value };
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
  const activeMaxOffset = reverseDirection
    ? shadowTuning.maxOffsetReverse
    : allowShadowYFollow
      ? shadowTuning.maxOffset
      : shadowTuning.maxOffsetXOnly;
  const shadowDistance = activeMaxOffset * shadowStrength;
  const innerRadiusRange = Math.max(radius - shadowTuning.innerDeadZone, 1);
  const distanceRamp = clamp(
    (distance - shadowTuning.innerDeadZone) / innerRadiusRange,
    0,
    1,
  );
  const deadZoneExitRamp = clamp(
    (distance - shadowTuning.innerDeadZone) /
      Math.max(shadowTuning.innerDeadZone, 1),
    0,
    1,
  );
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
  const directionMultiplier = reverseDirection ? -1 : 1;

  const targetOffsetX =
    deltaX * directionScale * offsetRamp * directionMultiplier;
  const targetOffsetY = allowShadowYFollow
    ? deltaY * directionScale * offsetRamp * directionMultiplier
    : 0;
  const offsetLerp = isHovered
    ? shadowTuning.offsetEnterLerp
    : shadowTuning.offsetLeaveLerp;
  const x = previousOffset.x + (targetOffsetX - previousOffset.x) * offsetLerp;
  const y = previousOffset.y + (targetOffsetY - previousOffset.y) * offsetLerp;
  const visible =
    hoverProgress > 0.01 && Math.hypot(x, y) > shadowTuning.visibilityThreshold;

  return { x, y, visible };
}
