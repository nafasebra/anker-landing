"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useBrowserCapabilities } from "./hooks/use-browser-capabilities";
import { useProductScroll } from "./hooks/use-product-scroll";
import { useProductAnchor } from "./hooks/use-product-anchor";
import { ProductViewport } from "./product-viewport";
import { FeatureCallout } from "./feature-callout";
import { FeatureNavigation } from "./feature-navigation";

export default function ProductExperience({ children }: { children: ReactNode }) {
  useBrowserCapabilities();
  const root = useProductScroll();
  const { connector, hotspot, onAnchor } = useProductAnchor();
  return (
    <>
      <Link
        className="fixed -top-[100px] left-5 z-[100] bg-[#91bfff] p-[15px] text-[#111] focus:top-[15px]"
        href="#features"
      >
        Skip to product features
      </Link>
      <ProductViewport onAnchor={onAnchor} />
      <main ref={root}>{children}</main>
      <FeatureCallout connector={connector} hotspot={hotspot} />
      <FeatureNavigation />
    </>
  );
}
