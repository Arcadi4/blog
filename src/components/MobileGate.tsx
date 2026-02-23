"use client";

import { useEffect, useState } from "react";

const PHONE_UA_REGEX =
  /Android.*Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;
const PHONE_PLATFORM_REGEX = /iPhone|iPod|Windows Phone/i;
const TABLET_UA_REGEX =
  /iPad|Tablet|PlayBook|Silk|Kindle|Nexus 7|Nexus 9|Nexus 10|SM-T/i;
const BLOCK_MAX_WIDTH = 960;

type NavigatorWithUAData = Navigator & {
  userAgentData?: { mobile?: boolean; platform?: string };
};

function getViewportWidth() {
  const widths = [
    window.visualViewport?.width ?? 0,
    window.innerWidth,
    document.documentElement?.clientWidth ?? 0,
  ].filter((value) => value > 0);

  if (widths.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.min(...widths);
}

function isPhoneLikeDevice() {
  const navigatorWithUAData = navigator as NavigatorWithUAData;

  if (navigatorWithUAData.userAgentData?.mobile === true) {
    return true;
  }

  const userAgent = navigator.userAgent || "";
  const vendor = navigator.vendor || "";
  const platform = navigator.platform || "";
  const uaPlatform = navigatorWithUAData.userAgentData?.platform || "";

  if (PHONE_PLATFORM_REGEX.test(`${platform} ${uaPlatform}`)) {
    return true;
  }

  return PHONE_UA_REGEX.test(`${userAgent} ${vendor}`);
}

function isTabletLikeDevice() {
  const navigatorWithUAData = navigator as NavigatorWithUAData;

  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const uaPlatform = navigatorWithUAData.userAgentData?.platform || "";
  const hasTouch = navigator.maxTouchPoints > 1;

  const isAndroidTablet =
    /Android/i.test(userAgent) && !/Mobile/i.test(userAgent);
  const isTabletUA = TABLET_UA_REGEX.test(
    `${userAgent} ${platform} ${uaPlatform}`,
  );
  const isDesktopIpadUA = /Macintosh/i.test(userAgent) && hasTouch;

  return isAndroidTablet || isTabletUA || isDesktopIpadUA;
}

function shouldBlockMobileAccess() {
  const viewportWidth = getViewportWidth();
  if (viewportWidth <= BLOCK_MAX_WIDTH) {
    return true;
  }

  if (isTabletLikeDevice()) {
    return false;
  }

  return isPhoneLikeDevice();
}

export default function MobileGate() {
  const [shouldBlock, setShouldBlock] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return shouldBlockMobileAccess();
  });

  useEffect(() => {
    const updateShouldBlock = () => setShouldBlock(shouldBlockMobileAccess());
    const orientation = window.screen.orientation;
    const widthQuery = window.matchMedia(`(max-width: ${BLOCK_MAX_WIDTH}px)`);

    const frameId = window.requestAnimationFrame(updateShouldBlock);

    window.addEventListener("resize", updateShouldBlock);
    window.addEventListener("orientationchange", updateShouldBlock);
    window.visualViewport?.addEventListener("resize", updateShouldBlock);
    orientation?.addEventListener("change", updateShouldBlock);
    widthQuery.addEventListener("change", updateShouldBlock);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateShouldBlock);
      window.removeEventListener("orientationchange", updateShouldBlock);
      window.visualViewport?.removeEventListener("resize", updateShouldBlock);
      orientation?.removeEventListener("change", updateShouldBlock);
      widthQuery.removeEventListener("change", updateShouldBlock);
    };
  }, []);

  useEffect(() => {
    if (!shouldBlock) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldBlock]);

  if (!shouldBlock) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-klein px-8 text-center text-white">
      <div className="fixed inset-x-8 -inset-y-1 border border-white pointer-events-none" />
      <div className="fixed inset-y-10 -inset-x-1 border border-white pointer-events-none" />
      <div className="space-y-4 m-8">
        <h1 className="text-6xl font-bold">Oooops!</h1>
        <p className="font-mono">
          The mobile version is under development. Please access through a
          desktop browser for the best experience.
        </p>
        <p className="font-mono">
          iPad or tablet users, try to rotate your device to landscape mode.
        </p>
      </div>
    </div>
  );
}
