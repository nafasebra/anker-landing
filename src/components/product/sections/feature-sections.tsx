import { features } from "../features";
const sectionClass =
  "relative h-svh min-h-[780px] px-[6%] pointer-events-none md:min-h-[700px] md:px-[7.1%] [&_a]:pointer-events-auto [&_button]:pointer-events-auto";
const headingClass =
  "my-[18px] text-[clamp(42px,10.5vw,68px)] leading-[1.04] font-heading font-bold tracking-[-.065em] md:my-[25px] md:text-[clamp(48px,5.5vw,88px)]";
const copyClass =
  "absolute top-[52%] left-[7%] z-20 max-w-[86%] md:top-[33%] md:left-[7.1%] md:max-w-[40%]";
const descriptionClass =
  "max-w-[310px] text-sm leading-[1.7] text-[#999ca3] md:max-w-[290px] md:leading-[1.8]";
import { Eyebrow, SectionNumber } from "../ui";
export function FeatureSections() {
  return (
    <div id="features">
      {features.map((feature, index) => (
        <section
          className={sectionClass}
          id={feature.id}
          key={feature.id}
          aria-labelledby={`${feature.id}-title`}
        >
          <div data-feature-copy className={copyClass}>
            <Eyebrow>{feature.eyebrow}</Eyebrow>
            <h2 className={headingClass} id={`${feature.id}-title`}>
              {feature.title.map((line, i) => (
                <span key={line} className={i ? "text-white/40 block" : "block"}>
                  {line}
                </span>
              ))}
            </h2>
            <p className={descriptionClass}>{feature.description}</p>
            <div className="mt-[38px] hidden items-center gap-[14px] text-sm text-[#696e78] md:flex [&>span:first-child]:text-[#91bfff]">
              <span>0{index + 1}</span>
              <span className="h-px w-[55px] bg-[#373b42]" />
              <span>04</span>
            </div>
          </div>
          <SectionNumber>02 — CONSIDERED IN EVERY DETAIL</SectionNumber>
        </section>
      ))}
    </div>
  );
}
