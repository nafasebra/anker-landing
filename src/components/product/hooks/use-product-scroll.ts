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
        let pointerFrame = 0;
        let pointerX = 0;
        let pointerY = 0;
        const pointer = (event: PointerEvent) => {
          if (event.pointerType !== "mouse" || store.getState().phase > 0.9) return;
          pointerX = (event.clientX / window.innerWidth - 0.5) * 0.15;
          pointerY = (event.clientY / window.innerHeight - 0.5) * 0.08;
          if (!pointerFrame)
            pointerFrame = requestAnimationFrame(() => {
              pointerFrame = 0;
              if (store.getState().phase <= 0.9) store.getState().setPointer(pointerX, pointerY);
            });
        };
        window.addEventListener("pointermove", pointer, { passive: true });
        return () => {
          window.removeEventListener("pointermove", pointer);
          cancelAnimationFrame(pointerFrame);
        };
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
