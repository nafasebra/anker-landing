"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { Eyebrow, StatusDot, PrimaryButton } from "../ui";

const AvailabilityDialog = dynamic(() =>
  import("../availability-dialog").then((module) => module.AvailabilityDialog),
);
export function FinalProductSection() {
  const [open, setOpen] = useState(false);
  const closeDialog = useCallback(() => setOpen(false), []);
  return (
    <>
      <section
        id="product"
        className="relative h-svh min-h-[780px] pointer-events-none px-[6%] md:min-h-[700px] md:px-[7.1%] [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
        aria-labelledby="product-title"
      >
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
          <p className="text-sm text-[#b2b6bc]">
            Soundcore R50i <span className="text-white/25">/</span> A3949
          </p>
          <p className="mt-3 mb-[18px] text-sm leading-[1.8] text-[#7d838b] md:mt-[22px] md:mb-7">
            A compact case. A personal soundtrack.
            <br />
            Make a little room for your sound.
          </p>
          <PrimaryButton onClick={() => setOpen(true)}>
            Check availability <span aria-hidden="true">↗</span>
          </PrimaryButton>
          <span
            className={"mt-5 hidden text-sm leading-[1.7] tracking-[1.6px] text-white/35 md:block"}
          >
            GRAPHITE BLACK · BY ANKER
          </span>
        </div>
        <footer className="absolute inset-x-[3.5%] bottom-0 z-20 flex items-center justify-between border-t border-[#ffffff10] px-[3%] py-5 text-sm text-[#727780] md:px-[3.8%] md:py-[27px] [&>a:first-child]:text-[15px] [&>a:first-child]:text-[#ddd] md:[&>a:first-child]:text-lg [&>span]:hidden md:[&>span]:inline">
          <Link href="#" className="font-semibold tracking-tight">
            soundcore <span className="text-white/35 font-normal text-sm">by Anker</span>
          </Link>
          <Link href="#overview">Back to top ↑</Link>
        </footer>
      </section>
      {open && <AvailabilityDialog open={open} onClose={closeDialog} />}
    </>
  );
}
