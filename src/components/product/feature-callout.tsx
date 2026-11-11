"use client";
import { useProductStore } from "./store/product-store-provider";
import { selectCalloutVisible, selectActiveFeature } from "./store/product-store";
import { memo } from "react";
import type { RefObject } from "react";
import { features } from "./features";

export const FeatureCallout = memo(function FeatureCallout({
  connector,
  hotspot,
}: {
  connector: RefObject<SVGPolylineElement | null>;
  hotspot: RefObject<SVGCircleElement | null>;
}) {
  const visible = useProductStore(selectCalloutVisible);
  const active = useProductStore(selectActiveFeature);
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[21] transition-opacity duration-350 ${visible ? "opacity-100" : "opacity-0"}`}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          ref={connector}
          fill="none"
          stroke="#80b8ff"
          strokeWidth=".6"
          vectorEffect="non-scaling-stroke"
        />
        <circle ref={hotspot} r=".36" fill="#91bfff" />
      </svg>
      <div
        className="absolute top-[46%] left-[60%] max-w-[35%] motion-safe:animate-label-in md:top-[68%] md:left-[79%] md:max-w-[18%] [&_p]:mt-[5px] [&_p]:hidden [&_p]:text-sm [&_p]:leading-normal [&_p]:text-[#8b929e] md:[&_p]:block"
        key={active}
      >
        <span className={"text-sm leading-[1.7] tracking-[1.6px] text-[#9b9da3]"}>
          {features[active].detail}
        </span>
        <p>{features[active].note}</p>
      </div>
    </div>
  );
});
