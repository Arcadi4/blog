import type { AnchorHTMLAttributes } from "react";
import type { FalloffMode, ProximityShadowTuning } from "./proximityLinkMath";

export interface ProximityLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> {
  href: string;
  children?: string;
  label?: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  radius?: number;
  falloff?: FalloffMode;
  shadowColor?: string;
  allowShadowYFollow?: boolean;
  reverseShadowDirection?: boolean;
  reverseShadowNearStronger?: boolean;
  shadowTuning?: Partial<ProximityShadowTuning>;
}
