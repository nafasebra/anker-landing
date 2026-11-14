"use client";
import { useEffect } from "react";
import { useProductStoreApi } from "../store/product-store-provider";
export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function useBrowserCapabilities() {
  const store = useProductStoreApi();
  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery);
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const updateCapabilities = () =>
      store
        .getState()
        .setCapabilities(
          true,
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
