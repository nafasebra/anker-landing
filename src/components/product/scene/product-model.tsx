"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import * as THREE from "three";
import type { Pose, ProductSceneProps } from "../types";
import { MODEL_URL, poses } from "./poses";
import { applyProductPose, getTargetPose } from "./animation";
import { createModelObjects } from "./model-objects";
import { useProductStore, useProductStoreApi } from "../store/product-store-provider";
import { selectIsExploring } from "../store/product-store";
export function ProductModel({ onAnchor }: ProductSceneProps) {
  const store = useProductStoreApi();
  const reduced = useProductStore((state) => state.reduced);
  const interactive = useProductStore(selectIsExploring);
  const onLoaded = useProductStore((state) => state.markLoaded);
  const { scene } = useGLTF(MODEL_URL);
  const { invalidate, viewport, camera, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const controls = useRef<OrbitControlsType>(null);
  const previousReset = useRef(0);
  const current = useRef<Pose>({ ...poses[0] });
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const objects = useMemo(() => createModelObjects(scene), [scene]);
  const { model, materials } = objects;
  // Three.js objects are mutable scene state, owned by the animation loop.
  const animatedObjects = useRef<typeof objects | null>(null);

  useEffect(() => {
    animatedObjects.current = objects;
    return () => {
      animatedObjects.current = null;
    };
  }, [objects]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => invalidate());
    const onVisibilityChange = () => invalidate();
    document.addEventListener("visibilitychange", onVisibilityChange);
    onLoaded();
    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      materials.forEach((m) => m.dispose());
    };
  }, [invalidate, store, materials, onLoaded]);
  useEffect(() => {
    if (!interactive) controls.current?.reset();
    invalidate();
  }, [interactive, invalidate]);

  useFrame((_, delta) => {
    if (!group.current || !animatedObjects.current || document.hidden) return;
    const { model } = animatedObjects.current;
    const motion = store.getState();
    const phase = THREE.MathUtils.clamp(motion.phase, 0, 7);
    const target = getTargetPose(phase, reduced, size.width, viewport.width);
    let difference = 0;
    const lerp = reduced ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 10);
    for (const key of Object.keys(target) as (keyof Pose)[]) {
      current.current[key] = THREE.MathUtils.lerp(current.current[key], target[key], lerp);
      difference += Math.abs(current.current[key] - target[key]);
    }
    applyProductPose(
      group.current,
      animatedObjects.current,
      current.current,
      motion,
      reduced,
      interactive,
    );
    const highlight = phase > 1.7 && phase < 4.7 ? Math.round(phase) : -1;
    const partName =
      highlight === 2
        ? "Left_Organic_Housing"
        : highlight === 3
          ? "Left_Silicone_Tip"
          : highlight === 4
            ? "Left_Touch_Surface"
            : "";
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const mat = object.material as THREE.MeshStandardMaterial;
        mat.emissive.set(object.name === partName ? "#1678c8" : "#000000");
        mat.emissiveIntensity = object.name === partName ? 0.18 : 0;
      }
    });
    if (phase > 1.65 && phase < 5.55) {
      const part = model.getObjectByName(partName || "Case_Base");
      if (part) {
        group.current.updateWorldMatrix(true, true);
        part.getWorldPosition(anchor);
        anchor.project(camera);
        onAnchor((anchor.x * 0.5 + 0.5) * 100, (-anchor.y * 0.5 + 0.5) * 100);
      }
    }
    if (motion.reset !== previousReset.current) {
      controls.current?.reset();
      previousReset.current = motion.reset;
      invalidate();
    }
    if (difference > 0.002) invalidate();
  });

  return (
    <>
      <group ref={group}>
        <primitive object={model} />
      </group>
      <OrbitControls
        ref={controls}
        enabled={interactive}
        enableZoom={false}
        enablePan={false}
        enableDamping={false}
        minPolarAngle={Math.PI * 0.32}
        maxPolarAngle={Math.PI * 0.65}
        rotateSpeed={0.65}
        target={[0, 0, 0]}
      />
    </>
  );
}
