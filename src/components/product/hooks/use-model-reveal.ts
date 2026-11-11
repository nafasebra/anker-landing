"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "../animations/gsap";
import { useProductStore, useProductStoreApi } from "../store/product-store-provider";

export function useModelReveal(ready: boolean) {
  const root = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const store = useProductStoreApi();
  const reduced = useProductStore((state) => state.reduced);

  useGSAP(
    () => {
      if (!ready || !scene.current) return;
      const markRevealed = store.getState().markRevealed;
      if (reduced || store.getState().revealed) {
        gsap.set(scene.current, { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(loader.current, { autoAlpha: 0 });
        markRevealed();
        return;
      }

      gsap
        .timeline({ onComplete: markRevealed })
        .to(loader.current, { autoAlpha: 0, y: -8, duration: 0.25, ease: "power2.out" }, 0)
        .fromTo(
          scene.current,
          { autoAlpha: 0, y: 24, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.15, ease: "power3.out" },
          0.1,
        );
    },
    { scope: root, dependencies: [ready, reduced, store], revertOnUpdate: true },
  );

  return { root, scene, loader };
}
