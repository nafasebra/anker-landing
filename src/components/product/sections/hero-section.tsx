import Link from "next/link";
const tinyLabelClass = "text-sm leading-[1.7] tracking-[1.6px] text-[#9b9da3]";
import { Eyebrow, StatusDot, PrimaryLink } from "../ui";
import { ProductBackground } from "../product-background";
export function HeroSection() {
  return (
    <section
      className="relative h-svh min-h-[780px] pointer-events-none px-[6%] pt-[125px] md:min-h-[700px] md:px-[7.1%] md:pt-[clamp(130px,16vh,190px)] [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
      id="overview"
      aria-labelledby="hero-title"
    >
      <ProductBackground chapter="hero" />
      <div className="relative z-[11]">
        <Eyebrow>
          <StatusDot /> SOUNDCORE R50i <span className="text-white/25">/</span> TRUE WIRELESS
          EARBUDS
        </Eyebrow>
        <h1
          className="mt-[22px] text-[clamp(61px,14.6vw,100px)] leading-[.98] font-heading font-black tracking-[-.075em] md:mt-[21px] md:text-[clamp(75px,8.6vw,144px)]"
          id="hero-title"
        >
          Small size.
          <br />
          <span className="pl-[9%] md:pl-[16.6%]">
            Big sound<span className="text-blue-400">.</span>
          </span>
        </h1>
      </div>
      <div className="absolute inset-x-[6%] bottom-[12%] z-20 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end md:inset-x-[7.1%] md:bottom-[13.5%] md:items-end">
        <div className="hidden lg:block [&_p]:mt-[15px] [&_p]:text-lg [&_p]:leading-normal [&_p]:tracking-[-.4px] [&_p]:text-[#d4d4d6]">
          <span className={tinyLabelClass}>LESS TO CARRY. MORE TO FEEL.</span>
          <p>
            A small escape.
            <br />
            Always within reach.
          </p>
        </div>
        <div className="flex flex-col items-start gap-[18px] md:items-center">
          <PrimaryLink href="#reveal">
            Explore the sound <span aria-hidden="true">↗</span>
          </PrimaryLink>
          <Link
            className="flex gap-[30px] text-sm text-[#a4a6ab] hover:text-white"
            href="#features"
          >
            View features <span>↓</span>
          </Link>
        </div>
      </div>
      <Link
        className="absolute bottom-[30px] left-[6%] z-20 flex items-center gap-[14px] tracking-[1.7px] text-[#777c83] md:bottom-[35px] md:left-[7.1%] [&>span:last-child]:text-[#c1c5cc]"
        href="#reveal"
      >
        <span className="h-px w-8 bg-[#777c83]" /> SCROLL TO DISCOVER <span>↓</span>
      </Link>
      <span
        className="absolute right-[4%] bottom-2 text-[120px] leading-none font-semibold tracking-[-14px] text-[#ffffff02] md:text-[180px]"
        aria-hidden="true"
      >
        R50i
      </span>
    </section>
  );
}
