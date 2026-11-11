"use client";
import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProductStoreApi } from "../store/product-store-provider";
import { reducedMotionQuery } from "./use-browser-capabilities";
export function useProductScroll() {
  const root = useRef<HTMLElement>(null);
  const store = useProductStoreApi();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = window.matchMedia(reducedMotionQuery);
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const value = self.progress * 7;
        store.getState().setPhase(value);
      },
    });
    const labels = gsap.context(() => {
      if (media.matches) return;
      gsap.utils.toArray<HTMLElement>("[data-feature-copy]").forEach((label) => {
        gsap.fromTo(
          label,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: label.closest("section"),
              start: "top 65%",
              end: "top 15%",
              scrub: true,
            },
          },
        );
        gsap.to(label, {
          opacity: 0,
          y: -20,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: label.closest("section"),
            start: "top -35%",
            end: "top -80%",
            scrub: true,
          },
        });
      });
    }, root);
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || media.matches || store.getState().phase > 0.9) return;
      store
        .getState()
        .setPointer(
          (event.clientX / window.innerWidth - 0.5) * 0.15,
          (event.clientY / window.innerHeight - 0.5) * 0.08,
        );
    };
    window.addEventListener("pointermove", pointer, { passive: true });
    return () => {
      trigger.kill();
      labels.revert();
      window.removeEventListener("pointermove", pointer);
    };
  }, [store]);

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
