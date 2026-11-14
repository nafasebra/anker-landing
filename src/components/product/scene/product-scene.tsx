"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { ProductSceneProps } from "../types";
import { useSceneVisibility } from "../hooks/use-scene-visibility";
import { SceneBoundary } from "./scene-boundary";
import { ProductModel } from "./product-model";
import { StudioLights } from "./studio-lighting";
import { useProductStore } from "../store/product-store-provider";

export default function ProductScene(props: ProductSceneProps) {
  const visible = useSceneVisibility();
  const onError = useProductStore((state) => state.markSceneFailed);
  const maxDpr = useProductStore((state) => (state.reduced ? 1.25 : state.maxDpr));
 
  return (
    <SceneBoundary onError={onError}>
      <Canvas
        frameloop={visible ? "demand" : "never"}
        dpr={[1, maxDpr]}
        camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
          gl.domElement.addEventListener("webglcontextlost", onError, { once: true });
        }}
      >
        <StudioLights />
        <Suspense fallback={null}>
          <ProductModel {...props} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
