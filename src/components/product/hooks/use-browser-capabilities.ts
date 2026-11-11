"use client";
import { useEffect } from "react";
import { useProductStoreApi } from "../store/product-store-provider";
export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
let webglAvailable: boolean | undefined;

function getWebglAvailability() {
  if (webglAvailable === undefined) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    webglAvailable = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return webglAvailable;
}

export function useBrowserCapabilities() {
  const store = useProductStoreApi();
  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery);
    store.getState().setCapabilities(getWebglAvailability(), media.matches);
    const updateReduced = () => store.getState().setReducedMotion(media.matches);
    media.addEventListener("change", updateReduced);
    return () => media.removeEventListener("change", updateReduced);
  }, [store]);
}
