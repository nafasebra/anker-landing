"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ProductSceneProps } from "./types";
import { useProductStore } from "./store/product-store-provider";
import { selectAvailable } from "./store/product-store";
import { useModelReveal } from "./hooks/use-model-reveal";
import { useDeferredScene } from "./hooks/use-deferred-scene";

const ProductScene = dynamic(() => import("./scene/product-scene"), { ssr: false });

export const ProductViewport = memo(function ProductViewport({ onAnchor }: ProductSceneProps) {
  const available = useProductStore(selectAvailable);
  const loaded = useProductStore((state) => state.loaded);
  const sceneReady = useDeferredScene();
  const { root, scene, loader } = useModelReveal(available === true && loaded);
 
  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-10 h-svh [&_canvas]:relative [&_canvas]:z-[1]"
    >
      <div className="absolute top-[12%] left-[14%] h-[90%] w-[85%] rounded-full bg-[radial-gradient(ellipse,#41577519,#23272d17_40%,transparent_68%)]" />
      {available === true && sceneReady && (
        <div
          ref={scene}
          className="absolute inset-0 opacity-0"
        >
          <ProductScene onAnchor={onAnchor} />
        </div>
      )}
      <div
        ref={available === false ? undefined : loader}
        className="absolute inset-0"
        aria-hidden={available !== false && loaded}
      >
        <div className="absolute inset-x-[8%] top-[16%] bottom-[45%] flex items-center justify-center md:inset-x-[20%] md:top-[25%] md:bottom-[12%]">
          <Image
            width={800}
            height={650}
            src="/product-fallback.svg"
            alt="Black Soundcore charging case and earbuds"
            preload
            className="h-full w-full object-contain"
          />
        </div>
        <div
          className="absolute inset-x-6 top-[57%] flex items-center justify-center gap-2 text-center text-sm tracking-[1px] text-[#a5b3c6] md:top-auto md:bottom-[9%]"
          role={available !== false && !loaded ? "status" : undefined}
        >
          {available === false ? (
            <span>Product preview · 3D is unavailable on this device</span>
          ) : (
            <>
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full border border-[#91bfff33] border-t-[#91bfff] motion-safe:animate-spin"
              />
              <span>
                Preparing your sound<span className="text-white/25"> / 3D</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
