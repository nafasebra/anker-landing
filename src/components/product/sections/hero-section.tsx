import { sectionClass, tinyLabelClass } from "../styles";
import { Eyebrow, StatusDot, PrimaryLink } from "../ui";
import { ProductBackground } from "../product-background";
export function HeroSection() {
  return (
    <section
      className={`${sectionClass} pt-[125px] md:pt-[clamp(130px,16vh,190px)]`}
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
        <p className="mt-5 ml-[10%] text-[11px] tracking-[-.1px] text-[#a0a2a6] md:absolute md:top-[48%] md:right-0 md:m-0 md:text-[13px]">
          Meet the Soundcore R50i.
        </p>
      </div>
      <div className="absolute inset-x-[6%] bottom-[12%] z-20 flex items-center justify-between md:inset-x-[7.1%] md:bottom-[13.5%] md:items-end">
        <div className="hidden md:block [&_p]:mt-[15px] [&_p]:text-lg [&_p]:leading-normal [&_p]:tracking-[-.4px] [&_p]:text-[#d4d4d6]">
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
          <a
            className="flex gap-[30px] text-[10px] text-[#a4a6ab] hover:text-white"
            href="#features"
          >
            View features <span>↓</span>
          </a>
        </div>
        <div className="relative mb-[38px] pl-[19px] text-[7px] tracking-[1.2px] text-[#b6b8be] md:mb-[35px] md:text-[8px] [&_small]:mt-[9px] [&_small]:block [&_small]:text-[8px] [&_small]:text-[#62666e]">
          <span className="absolute -top-px left-0 size-2.5 rounded-full border border-[#64666a] bg-[#17191c] shadow-[0_0_0_3px_#ffffff06]" />{" "}
          GRAPHITE BLACK<small>ANKER / A3949</small>
        </div>
      </div>
      <a
        className="absolute bottom-[30px] left-[6%] z-20 flex items-center gap-[14px] text-[6px] tracking-[1.7px] text-[#777c83] md:bottom-[35px] md:left-[7.1%] md:text-[7px] [&>span:last-child]:text-[#c1c5cc]"
        href="#reveal"
      >
        <span className="h-px w-8 bg-[#777c83]" /> SCROLL TO DISCOVER <span>↓</span>
      </a>
      <span
        className="absolute right-[4%] bottom-2 text-[120px] leading-none font-semibold tracking-[-14px] text-[#ffffff02] md:text-[180px]"
        aria-hidden="true"
      >
        R50i
      </span>
    </section>
  );
}
