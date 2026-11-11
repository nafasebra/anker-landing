"use client";
import { useProductStore } from "../store/product-store-provider";
import { sectionClass, headingClass, copyClass, descriptionClass } from "../styles";
import { Eyebrow, SectionNumber } from "../ui";
export function ExploreSection() {
  const onReset = useProductStore((state) => state.resetView);
  const onRotate = useProductStore((state) => state.rotateView);
  return (
    <section id="explore" className={sectionClass} aria-labelledby="explore-title">
      <div className={copyClass}>
        <Eyebrow>EVERY ANGLE. YOURS.</Eyebrow>
        <h2 className={headingClass} id="explore-title">
          Take a<br />
          <span className="text-white/40">closer look.</span>
        </h2>
        <p className={`${descriptionClass} hidden md:block`}>
          A little curiosity looks good on you.
        </p>
      </div>
      <div className="absolute bottom-[6%] left-[7%] z-20 flex w-[86%] flex-wrap items-center justify-center gap-3 text-[9px] text-[#878e99] md:bottom-[17%] md:left-[57%] md:w-[32%] md:gap-[22px] [&>span]:w-auto [&>span]:text-center [&>span]:text-[8px] md:[&>span]:w-full md:[&>span]:text-[9px] [&>span>span]:mr-2.5 [&>span>span]:text-[17px] [&>span>span]:text-[#aacbf8]">
        <span>
          <span aria-hidden="true">↔</span> Drag to rotate · scroll to continue
        </span>
        <button
          className="rounded-[30px] border border-[#ffffff25] px-[13px] py-2.5 text-[10px] text-[#c2c8d2] hover:border-[#91bfff] md:px-[18px] md:py-3 [&_span]:ml-4"
          onClick={onReset}
        >
          Reset view <span aria-hidden="true">↺</span>
        </button>
        <div
          className="hidden gap-[7px] md:flex [&_button]:size-[35px] [&_button]:rounded-full [&_button]:border [&_button]:border-[#ffffff20] [&_button]:text-[#d0d8e6]"
          aria-label="Rotate product"
        >
          <button aria-label="Rotate product left" onClick={() => onRotate(-1)}>
            ←
          </button>
          <button aria-label="Rotate product right" onClick={() => onRotate(1)}>
            →
          </button>
        </div>
      </div>
      <SectionNumber>03 — EXPLORE IN 3D</SectionNumber>
    </section>
  );
}
