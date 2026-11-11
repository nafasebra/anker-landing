import Link from "next/link";
export const SiteHeader = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-18.75 items-center md:h-22 justify-between gap-3 border-b border-white/8 bg-[linear-gradient(#101113e8,#10111360)] px-4 backdrop-blur-[12px] sm:px-6 md:px-12">
      <Link
        href="#"
        className="relative pb-4 text-[22px] leading-none font-bold tracking-[-1.3px] md:text-[25px] [&_small]:absolute [&_small]:-bottom-px [&_small]:left-px [&_small]:text-sm [&_small]:font-normal [&_small]:tracking-[1.7px]"
        aria-label="Soundcore home"
      >
        soundcore<span className="ml-0.5 inline-block -rotate-40 text-[26px]">◔</span>
        <small>by Anker</small>
      </Link>
      <nav
        className="hidden items-center gap-9 text-sm text-white/55 md:flex"
        aria-label="Main navigation"
      >
        <Link className="transition hover:text-white" href="#reveal">
          Overview
        </Link>
        <Link className="transition hover:text-white" href="#features">
          The details
        </Link>
      </nav>
      <Link
        href="#product"
        className="rounded-full border border-white/25 px-3 py-2.5 text-sm whitespace-nowrap md:px-5 transition hover:border-blue-400 hover:bg-blue-400/10"
      >
        Discover R50i <span className="ml-2 md:ml-4">↗</span>
      </Link>
    </header>
  );
};
