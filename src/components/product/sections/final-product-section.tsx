"use client";
import { useCallback, useState } from "react";
import { AvailabilityDialog } from "../availability-dialog";
import { sectionClass } from "../styles";
import { Eyebrow, StatusDot, PrimaryButton } from "../ui";
import { ProductBackground } from "../product-background";
export function FinalProductSection() {
  const [open, setOpen] = useState(false);
  const closeDialog = useCallback(() => setOpen(false), []);
  return (
    <>
      <section id="product" className={sectionClass} aria-labelledby="product-title">
        <ProductBackground chapter="final" />
        <div className="absolute top-[54%] left-[7%] z-20 md:top-[24%] md:left-[58%]">
          <Eyebrow>
            <StatusDot /> YOUR EVERYDAY SOUNDTRACK
          </Eyebrow>
          <h2
            className="my-[13px] text-[43px] leading-[1.04] font-heading font-bold tracking-[-.065em] md:my-[25px] md:text-[clamp(48px,5.5vw,88px)]"
            id="product-title"
          >
            Go small.
            <br />
            Feel more<span className="text-blue-400">.</span>
          </h2>
          <p className="text-[13px] text-[#b2b6bc]">
            Soundcore R50i <span className="text-white/25">/</span> A3949
          </p>
          <p className="mt-3 mb-[18px] text-[11px] leading-[1.8] text-[#7d838b] md:mt-[22px] md:mb-7 md:text-xs">
            A compact case. A personal soundtrack.
            <br />
            Make a little room for your sound.
          </p>
          <PrimaryButton onClick={() => setOpen(true)}>
            Check availability <span aria-hidden="true">↗</span>
          </PrimaryButton>
          <span
            className={
              "mt-5 hidden text-[8px] leading-[1.7] tracking-[1.6px] text-white/35 md:block"
            }
          >
            GRAPHITE BLACK · BY ANKER
          </span>
        </div>
        <footer className="absolute inset-x-[3.5%] bottom-0 z-20 flex items-center justify-between border-t border-[#ffffff10] px-[3%] py-5 text-[9px] text-[#727780] md:px-[3.8%] md:py-[27px] [&>a:first-child]:text-[15px] [&>a:first-child]:text-[#ddd] md:[&>a:first-child]:text-lg [&>span]:hidden md:[&>span]:inline">
          <a href="#" className="font-semibold tracking-tight">
            soundcore <span className="text-white/35 font-normal text-xs">by Anker</span>
          </a>
          <a href="#overview">Back to top ↑</a>
        </footer>
      </section>
      <AvailabilityDialog open={open} onClose={closeDialog} />
    </>
  );
}
