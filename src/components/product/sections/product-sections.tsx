import { HeroSection } from "./hero-section";
import { RevealSection } from "./reveal-section";
import { FeatureSections } from "./feature-sections";
import { ExploreSection } from "./explore-section";
import { FinalProductSection } from "./final-product-section";

// Scroll progress changes the scene and overlays, not the section markup.
export function ProductSections() {
  return (
    <>
      <HeroSection />
      <RevealSection />
      <FeatureSections />
      <ExploreSection />
      <FinalProductSection />
    </>
  );
}
