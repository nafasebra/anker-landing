import { sectionClass, headingClass, copyClass, descriptionClass } from "../styles";
import { Eyebrow, SectionNumber } from "../ui";
export function RevealSection() {
  return (
    <section id="reveal" className={sectionClass} aria-labelledby="reveal-title">
      <div className={copyClass}>
        <Eyebrow>A LITTLE REVEAL</Eyebrow>
        <h2 className={headingClass} id="reveal-title">
          Open up.
          <br />
          <span className="text-white/40">Tune in.</span>
        </h2>
        <p className={descriptionClass}>Your everyday escape starts here.</p>
      </div>
      <SectionNumber>01 — THE REVEAL</SectionNumber>
    </section>
  );
}
