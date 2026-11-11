"use client";
import { useProductStore } from "./store/product-store-provider";
import { selectNavigationVisible, selectActiveFeature } from "./store/product-store";
import { useScrollToSection } from "./hooks/use-product-scroll";
import { memo } from "react";
import { features } from "./features";

export const FeatureNavigation = memo(function FeatureNavigation() {
  const visible = useProductStore(selectNavigationVisible);
  const active = useProductStore(selectActiveFeature);
  const goTo = useScrollToSection();
  return (
    <nav
      aria-label="Product features"
      className={`fixed bottom-[15px] left-1/2 z-40 flex w-max max-w-[96%] -translate-x-1/2 items-center gap-px rounded-[50px] border border-[#ffffff14] bg-[#191c22dd] p-[5px] backdrop-blur-[18px] transition-[opacity,translate] duration-350 md:bottom-9 md:w-auto md:gap-[5px] md:p-[7px] ${visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"}`}
      inert={!visible}
    >
      <span className="hidden px-[13px] text-[7px] tracking-[1.5px] whitespace-nowrap text-[#636b79] md:inline">
        THE DETAILS
      </span>
      {features.map((f, i) => (
        <button
          key={f.id}
          aria-current={active === i ? "step" : undefined}
          onClick={() => goTo(f.id)}
          className={`flex items-center gap-[6px] rounded-[30px] px-3 py-[11px] text-[9px] transition-[background,color] duration-250 md:gap-[9px] md:px-[17px] md:py-3 md:text-[10px] [&_span]:text-[7px] md:[&_span]:text-[8px] ${active === i ? "bg-[#3e72ad35] text-[#c2dcff] [&_span]:text-[#86b9ff]" : "text-[#b0b6bf] [&_span]:text-[#646b76]"}`}
        >
          <span>0{i + 1}</span>
          {f.name}
        </button>
      ))}
    </nav>
  );
});
