import { memo } from "react";
export const SiteHeader = memo(function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[75px] items-center md:h-22 justify-between border-b border-white/8 bg-[linear-gradient(#101113e8,#10111360)] px-6 backdrop-blur-[12px] md:px-12">
      <a
        href="#"
        className="relative pb-3 text-[22px] leading-none font-bold tracking-[-1.3px] md:text-[25px] [&_small]:absolute [&_small]:-bottom-px [&_small]:left-px [&_small]:text-[8px] [&_small]:font-normal [&_small]:tracking-[1.7px]"
        aria-label="Soundcore home"
      >
        soundcore<span className="ml-0.5 inline-block -rotate-40 text-[26px]">◔</span>
        <small>by Anker</small>
      </a>
      <nav
        className="hidden items-center gap-9 text-xs text-white/55 md:flex"
        aria-label="Main navigation"
      >
        <a className="transition hover:text-white" href="#reveal">
          Overview
        </a>
        <a className="transition hover:text-white" href="#features">
          The details
        </a>
        <a className="transition hover:text-white" href="#explore">
          Explore in 3D <span className="ml-1 text-blue-400">↗</span>
        </a>
      </nav>
      <a
        href="#product"
        className="rounded-full border border-white/25 px-5 py-2.5 text-[11px] transition hover:border-blue-400 hover:bg-blue-400/10"
      >
        Discover R50i <span className="ml-4">↗</span>
      </a>
    </header>
  );
});
