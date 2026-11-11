"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "./animations/gsap";
import { useProductStoreApi } from "./store/product-store-provider";

export function ProductBackground({ chapter }: { chapter: "hero" | "final" }) {
  const root = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const store = useProductStoreApi();

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 768px)",
        },
        (context) => {
          if (!context.conditions?.motion) return;
          const desktop = context.conditions.desktop;
          const animation = gsap.fromTo(
            image.current,
            {
              scale: 1.04,
              xPercent: desktop ? 2 : 0,
              yPercent: desktop ? 3 : 1.5,
              rotation: desktop ? -1 : 0,
            },
            {
              scale: desktop ? 1.22 : 1.12,
              xPercent: desktop ? -2 : 0,
              yPercent: desktop ? -3 : -1.5,
              rotation: desktop ? 1 : 0,
              duration: 1,
              ease: "none",
              paused: true,
            },
          );

          // Only scrub while this section enters or leaves the viewport.
          const updateProgress = (phase: number) =>
            animation.progress(gsap.utils.clamp(0, 1, phase - (chapter === "hero" ? 0 : 6)));
          updateProgress(store.getState().phase);
          return store.subscribe((state, previous) => {
            if (state.phase !== previous.phase) updateProgress(state.phase);
          });
        },
      );
      return () => media.revert();
    },
    { scope: root, dependencies: [store, chapter], revertOnUpdate: true },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div ref={image} className="absolute -inset-[6%] motion-safe:will-change-transform">
        <Image
          src="/adrien-olichon-RCAhiGJsUUE-unsplash.jpg"
          alt=""
          fill
          sizes="100vw"
          loading={chapter === "hero" ? "eager" : "lazy"}
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#10111345,#10111380)]" />
    </div>
  );
}
