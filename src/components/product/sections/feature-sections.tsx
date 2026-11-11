import { features } from "../features";
import { sectionClass, headingClass, copyClass, descriptionClass } from "../styles";
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
            <div className="mt-[38px] hidden items-center gap-[14px] text-[9px] text-[#696e78] md:flex [&>span:first-child]:text-[#91bfff]">
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
