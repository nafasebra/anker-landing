"use client";

import { useCallback, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../animations/gsap";
import { animateFeatureLabels, getScrollPhase, measureChapters } from "../animations/scroll-story";
import { useProductStoreApi } from "../store/product-store-provider";

export function useProductScroll() {
  const root = useRef<HTMLElement>(null);
  const store = useProductStoreApi();

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      let chapters = measureChapters(element);
      const updatePhase = (scrollY: number) =>
        store.getState().setPhase(getScrollPhase(scrollY, chapters));
      ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => updatePhase(self.scroll()),
        onRefresh: (self) => {
          chapters = measureChapters(element);
          updatePhase(self.scroll());
        },
      });

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        animateFeatureLabels(element);
      });

      let active = true;
      let refreshFrame = 0;
      const scheduleRefresh = () => {
        if (!active || refreshFrame) return;
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = 0;
          ScrollTrigger.refresh();
        });
      };
      let height = element.getBoundingClientRect().height;
      const observer = new ResizeObserver(([entry]) => {
        if (entry && entry.contentRect.height !== height) {
          height = entry.contentRect.height;
          scheduleRefresh();
        }
      });
      observer.observe(element);
      document.fonts.ready.then(scheduleRefresh);
      return () => {
        active = false;
        media.revert();
        observer.disconnect();
        cancelAnimationFrame(refreshFrame);
      };
    },
    { scope: root, dependencies: [store], revertOnUpdate: true },
  );

  return root;
}

export function useScrollToSection() {
  const store = useProductStoreApi();
  return useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({
        behavior: store.getState().reduced ? "instant" : "smooth",
        block: "start",
      });
    },
    [store],
  );
}
