"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ProductSceneProps } from "./types";
import { useProductStore } from "./store/product-store-provider";
import { selectAvailable } from "./store/product-store";
import { useModelReveal } from "./hooks/use-model-reveal";
const ProductScene = dynamic(() => import("./scene/product-scene"), { ssr: false });

export const ProductViewport = memo(function ProductViewport({ onAnchor }: ProductSceneProps) {
  const available = useProductStore(selectAvailable);
  const loaded = useProductStore((state) => state.loaded);
  const { root, scene, loader } = useModelReveal(available === true && loaded);
  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-10 h-svh [&_canvas]:relative [&_canvas]:z-[1]"
      aria-label="3D Soundcore R50i product visualization"
    >
      <div className="absolute top-[12%] left-[14%] h-[90%] w-[85%] rounded-full bg-[radial-gradient(ellipse,#41577519,#23272d17_40%,transparent_68%)]" />
      {available === true && (
        <div ref={scene} className="absolute inset-0 opacity-0">
          <ProductScene onAnchor={onAnchor} />
        </div>
      )}
      {available === false && (
        <div className="absolute inset-x-[8%] top-[16%] bottom-[45%] flex items-center justify-center md:inset-x-[20%] md:top-[25%] md:bottom-[12%] [&_img]:max-h-full [&_img]:w-full [&_span]:absolute [&_span]:bottom-0 [&_span]:text-[7px] [&_span]:text-[#7d838b] md:[&_span]:text-[9px]">
          <Image
            width={800}
            height={650}
            src="/product-fallback.svg"
            alt="Black Soundcore charging case and earbuds"
          />
          <span>Product preview · 3D is unavailable on this device</span>
        </div>
      )}
      {available !== false && (
        <div
          ref={loader}
          className="absolute top-[62%] left-1/2 flex -translate-x-1/2 items-center gap-2 text-[9px] tracking-[1px] whitespace-nowrap text-[#a5b3c6]"
          role={loaded ? undefined : "status"}
          aria-hidden={loaded}
        >
          <span className="size-3 rounded-full border border-[#91bfff33] border-t-[#91bfff] motion-safe:animate-spin" />
          Preparing your sound<span className="text-white/25"> / 3D</span>
        </div>
      )}
    </div>
  );
});
