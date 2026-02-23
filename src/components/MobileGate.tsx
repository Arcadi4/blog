"use client";

import { useEffect, useState } from "react";

const MOBILE_USER_AGENT_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Windows Phone|Kindle|Silk/i;
const MOBILE_PLATFORM_REGEX = /Android|iPhone|iPad|iPod|Windows Phone/i;
const BLOCK_MAX_WIDTH = 960;

function detectMobileUserAgent() {
  const navigatorWithUAData = navigator as Navigator & {
    userAgentData?: { mobile?: boolean; platform?: string };
  };

  if (navigatorWithUAData.userAgentData?.mobile) {
    return true;
  }

  if (
    MOBILE_PLATFORM_REGEX.test(
      navigatorWithUAData.userAgentData?.platform ?? "",
    )
  ) {
    return true;
  }

  const userAgent = navigator.userAgent || "";
  const vendor = navigator.vendor || "";

  return MOBILE_USER_AGENT_REGEX.test(`${userAgent} ${vendor}`);
}

function detectMobilePlatform() {
  const navigatorWithUAData = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };

  const platform = navigator.platform || "";
  const uaPlatform = navigatorWithUAData.userAgentData?.platform || "";

  return MOBILE_PLATFORM_REGEX.test(`${platform} ${uaPlatform}`);
}

function getViewportWidth() {
  const widths = [window.visualViewport?.width ?? 0, window.innerWidth].filter(
    (value) => value > 0,
  );

  if (widths.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.min(...widths);
}

function getScreenShortSide() {
  const screenSizes = [
    window.screen.width,
    window.screen.height,
    window.screen.availWidth,
    window.screen.availHeight,
  ].filter((value) => value > 0);

  if (screenSizes.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  const rawShortSide = Math.min(...screenSizes);
  const dpr = window.devicePixelRatio || 1;
  const normalizedShortSide = dpr > 1 ? rawShortSide / dpr : rawShortSide;

  return Math.min(rawShortSide, normalizedShortSide);
}

function detectTouchLikeDevice() {
  const hasTouchPoints = navigator.maxTouchPoints > 0;
  const hasTouchEvents = "ontouchstart" in window;
  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const hasNoHover = window.matchMedia("(hover: none)").matches;

  return hasTouchPoints || hasTouchEvents || hasCoarsePointer || hasNoHover;
}

function shouldBlockMobileAccess() {
  const viewportWidth = getViewportWidth();
  const screenShortSide = getScreenShortSide();
  const matchesViewportQuery = window.matchMedia(
    `(max-width: ${BLOCK_MAX_WIDTH}px)`,
  ).matches;
  const matchesDeviceViewportQuery = window.matchMedia(
    `(max-device-width: ${BLOCK_MAX_WIDTH}px)`,
  ).matches;
  const hasMobileUserAgent = detectMobileUserAgent();
  const hasMobilePlatform = detectMobilePlatform();
  const isTouchLikeDevice = detectTouchLikeDevice();

  const isNarrowViewport =
    viewportWidth <= BLOCK_MAX_WIDTH ||
    matchesViewportQuery ||
    matchesDeviceViewportQuery;
  const isNarrowScreen = screenShortSide <= BLOCK_MAX_WIDTH;

  return (
    hasMobileUserAgent ||
    hasMobilePlatform ||
    isNarrowViewport ||
    (isTouchLikeDevice && isNarrowScreen)
  );
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

    const frameId = window.requestAnimationFrame(updateShouldBlock);

    window.addEventListener("resize", updateShouldBlock);
    window.addEventListener("orientationchange", updateShouldBlock);
    window.visualViewport?.addEventListener("resize", updateShouldBlock);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateShouldBlock);
      window.removeEventListener("orientationchange", updateShouldBlock);
      window.visualViewport?.removeEventListener("resize", updateShouldBlock);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-klein px-8 text-center text-white">
      <div className="fixed inset-x-8 -inset-y-1 border border-white pointer-events-none" />
      <div className="fixed inset-y-10 -inset-x-1 border border-white pointer-events-none" />
      <div className="max-w-md space-y-4">
        <h1 className="text-6xl font-bold">Oooops!</h1>
        <p className="font-mono">
          The mobile version is under development.
          <br />
          Please access through a desktop browser for the best experience.
        </p>
      </div>
    </div>
  );
}
