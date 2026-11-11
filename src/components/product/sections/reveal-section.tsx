import { Eyebrow, SectionNumber } from "../ui";

export function RevealSection() {
  return (
    <section
      id="reveal"
      className="relative h-svh min-h-[780px] pointer-events-none px-[6%] md:min-h-[700px] md:px-[7.1%] [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
      aria-labelledby="reveal-title"
    >
      <div className="absolute top-[52%] left-[7%] z-20 max-w-[86%] md:top-[33%] md:left-[7.1%] md:max-w-[40%]">
        <Eyebrow>A LITTLE REVEAL</Eyebrow>
        <h2
          className="my-[18px] text-[clamp(42px,10.5vw,68px)] leading-[1.04] font-heading font-bold tracking-[-.065em] md:my-[25px] md:text-[clamp(48px,5.5vw,88px)]"
          id="reveal-title"
        >
          Open up.
          <br />
          <span className="text-white/40">Tune in.</span>
        </h2>
        <p className="max-w-[310px] text-sm leading-[1.7] text-[#999ca3] md:max-w-[290px] md:leading-[1.8]">
          Your everyday escape starts here.
        </p>
      </div>
      <SectionNumber>01 — THE REVEAL</SectionNumber>
    </section>
  );
}
