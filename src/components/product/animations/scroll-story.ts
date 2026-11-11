import { gsap } from "./gsap";

export function measureChapters(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll("section"),
    (section) => section.getBoundingClientRect().top + window.scrollY,
  );
}

// Use actual chapter positions, including the minimum heights on small screens.
export function getScrollPhase(scrollY: number, chapters: number[]) {
  for (let index = chapters.length - 1; index >= 0; index--) {
    if (scrollY >= chapters[index]) {
      if (index === chapters.length - 1) return index;
      const length = chapters[index + 1] - chapters[index];
      return index + Math.min(1, Math.max(0, (scrollY - chapters[index]) / Math.max(1, length)));
    }
  }
  return 0;
}

export function animateFeatureLabels(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-feature-copy]").forEach((label) => {
    // The original entry, hold, and exit intervals share one reversible trigger.
    gsap
      .timeline({
        scrollTrigger: {
          trigger: label.closest("section"),
          start: "top 65%",
          end: "top -80%",
          scrub: true,
        },
      })
      .fromTo(label, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 50, ease: "none" }, 0)
      .to(label, { opacity: 0, y: -20, duration: 45, ease: "none" }, 100);
  });
}
