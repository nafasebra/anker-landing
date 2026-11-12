"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Pose, ProductSceneProps } from "../types";
import { MODEL_URL, poses } from "./poses";
import { applyProductPose, getResponsivePose } from "./animation";
import {
  createModelObjects,
  featurePartNames,
  highlightProductPart,
  type ModelObjects,
} from "./model-objects";
import { createPoseTimeline, poseKeys, type PoseTimeline } from "./pose-timeline";
import { useGSAP } from "../animations/gsap";
import { useProductStore, useProductStoreApi } from "../store/product-store-provider";
export function ProductModel({ onAnchor }: ProductSceneProps) {
  const store = useProductStoreApi();
  const reduced = useProductStore((state) => state.reduced);
  const onLoaded = useProductStore((state) => state.markLoaded);
  const { scene } = useGLTF(MODEL_URL, "/draco/");
  const { invalidate, viewport, camera, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const timer = useRef<THREE.Timer | null>(null);
  const current = useRef<Pose>({ ...poses[0] });
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const targetPose = useRef<Pose>({ ...poses[0] });
  const poseTimeline = useRef<PoseTimeline | null>(null);
  const animatedObjects = useRef<ModelObjects | null>(null);

  useEffect(() => {
    const frameTimer = new THREE.Timer();
    frameTimer.connect(document);
    frameTimer.reset();
    timer.current = frameTimer;
    invalidate();
    return () => {
      timer.current = null;
      frameTimer.dispose();
    };
  }, [invalidate]);

  useGSAP(
    () => {
      poseTimeline.current = createPoseTimeline();
      return () => {
        poseTimeline.current = null;
      };
    },
    { dependencies: [store], revertOnUpdate: true },
  );

  useEffect(() => {
    const root = group.current;
    if (!root) return;
    const objects = createModelObjects(scene);
    animatedObjects.current = objects;
    root.add(objects.model);
    const unsubscribe = store.subscribe((next, previous) => {
      if (
        next.phase !== previous.phase ||
        next.pointerX !== previous.pointerX ||
        next.pointerY !== previous.pointerY
      )
        invalidate();
    });
    const onVisibilityChange = () => invalidate();
    document.addEventListener("visibilitychange", onVisibilityChange);
    onLoaded();
    invalidate();
    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.remove(objects.model);
      animatedObjects.current = null;
      objects.materials.forEach((material) => material.dispose());
    };
  }, [invalidate, store, scene, onLoaded]);
  useEffect(() => {
    invalidate();
  }, [reduced, invalidate]);

  useFrame(() => {
    const frameTimer = timer.current;
    if (
      !group.current ||
      !animatedObjects.current ||
      !poseTimeline.current ||
      !frameTimer ||
      document.hidden
    )
      return;
    frameTimer.update();
    const delta = frameTimer.getDelta();
    const motion = store.getState();
    const phase = THREE.MathUtils.clamp(motion.phase, 0, 7);
    const base = poseTimeline.current.seek(phase);
    const target = getResponsivePose(
      base,
      phase,
      reduced,
      size.width,
      viewport.width,
      targetPose.current,
    );
    let difference = 0;
    const lerp = reduced ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 10);
    for (const key of poseKeys) {
      current.current[key] = THREE.MathUtils.lerp(current.current[key], target[key], lerp);
      difference += Math.abs(current.current[key] - target[key]);
    }
    applyProductPose(group.current, animatedObjects.current, current.current, motion, reduced);
    const highlight = phase > 1.7 && phase < 4.7 ? Math.round(phase) : -1;
    const partName = featurePartNames[highlight - 2] ?? "";
    highlightProductPart(animatedObjects.current, partName);
    if (phase > 1.65 && phase < 5.55) {
      const part = animatedObjects.current.parts.get(partName || "Case_Base");
      if (part) {
        group.current.updateWorldMatrix(true, true);
        part.getWorldPosition(anchor);
        anchor.project(camera);
        onAnchor((anchor.x * 0.5 + 0.5) * 100, (-anchor.y * 0.5 + 0.5) * 100);
      }
    }
    if (difference > 0.002) invalidate();
  });

  return (
    <>
      <group ref={group} dispose={null} />
    </>
  );
}
