import { sectionClass, headingClass, copyClass, descriptionClass } from "../styles";
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
