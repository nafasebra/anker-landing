const sectionClass =
  "relative h-svh min-h-[780px] px-[6%] pointer-events-none md:min-h-[700px] md:px-[7.1%] [&_a]:pointer-events-auto [&_button]:pointer-events-auto";
const headingClass =
  "my-[18px] text-[clamp(42px,10.5vw,68px)] leading-[1.04] font-heading font-bold tracking-[-.065em] md:my-[25px] md:text-[clamp(48px,5.5vw,88px)]";
const copyClass =
  "absolute top-[52%] left-[7%] z-20 max-w-[86%] md:top-[33%] md:left-[7.1%] md:max-w-[40%]";
const descriptionClass =
  "max-w-[310px] text-sm leading-[1.7] text-[#999ca3] md:max-w-[290px] md:leading-[1.8]";
import { Eyebrow, SectionNumber } from "../ui";
export function ExploreSection() {
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
      <SectionNumber>03 — EXPLORE IN 3D</SectionNumber>
    </section>
  );
}
