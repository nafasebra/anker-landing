"use client";
import { useEffect } from "react";
import { useProductStoreApi } from "../store/product-store-provider";
export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
let webglAvailable: boolean | undefined;

function getWebglAvailability() {
  if (webglAvailable === undefined) {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      webglAvailable = Boolean(context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglAvailable = false;
    }
  }
  return webglAvailable;
}

export function useBrowserCapabilities() {
  const store = useProductStoreApi();
  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery);
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const updateCapabilities = () =>
      store
        .getState()
        .setCapabilities(
          getWebglAvailability(),
          media.matches,
          coarsePointer.matches || (navigator.hardwareConcurrency || 8) <= 4,
        );
    updateCapabilities();
    media.addEventListener("change", updateCapabilities);
    coarsePointer.addEventListener("change", updateCapabilities);
    return () => {
      media.removeEventListener("change", updateCapabilities);
      coarsePointer.removeEventListener("change", updateCapabilities);
    };
  }, [store]);
}
