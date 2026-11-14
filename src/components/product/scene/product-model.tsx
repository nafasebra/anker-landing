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
import { useProductFrameTimer } from "./use-product-frame-timer";

const ANCHOR_UPDATE_THRESHOLD = 0.1;

export function ProductModel({ onAnchor }: ProductSceneProps) {
  const store = useProductStoreApi();
  const reduced = useProductStore((state) => state.reduced);
  const onLoaded = useProductStore((state) => state.markLoaded);
  const { scene } = useGLTF(MODEL_URL, "/draco/");
  const { invalidate, viewport, camera, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const timer = useProductFrameTimer(invalidate);
  const current = useRef<Pose>({ ...poses[0] });
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const lastAnchor = useRef(new THREE.Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY));
  const targetPose = useRef<Pose>({ ...poses[0] });
  const poseTimeline = useRef<PoseTimeline | null>(null);
  const animatedObjects = useRef<ModelObjects | null>(null);
  const waitingForFirstFrame = useRef(false);

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
    waitingForFirstFrame.current = true;
    root.add(objects.model);
    const unsubscribe = store.subscribe((next, previous) => {
      if (next.phase !== previous.phase) invalidate();
    });
    const onVisibilityChange = () => invalidate();
    document.addEventListener("visibilitychange", onVisibilityChange);
    invalidate();
    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.remove(objects.model);
      animatedObjects.current = null;
      waitingForFirstFrame.current = false;
      objects.materials.forEach((material) => material.dispose());
    };
  }, [invalidate, store, scene]);
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
    applyProductPose(group.current, animatedObjects.current, current.current, motion);
    if (waitingForFirstFrame.current) {
      waitingForFirstFrame.current = false;
      onLoaded();
    }
    const highlight = phase > 1.7 && phase < 4.7 ? Math.round(phase) : -1;
    const partName = featurePartNames[highlight - 2] ?? "";
    highlightProductPart(animatedObjects.current, partName);
    if (phase > 1.65 && phase < 5.55) {
      const part = animatedObjects.current.parts.get(partName || "Case_Base");
      if (part) {
        group.current.updateWorldMatrix(true, true);
        part.getWorldPosition(anchor);
        anchor.project(camera);
        const x = (anchor.x * 0.5 + 0.5) * 100;
        const y = (-anchor.y * 0.5 + 0.5) * 100;
        if (
          Math.abs(lastAnchor.current.x - x) > ANCHOR_UPDATE_THRESHOLD ||
          Math.abs(lastAnchor.current.y - y) > ANCHOR_UPDATE_THRESHOLD
        ) {
          lastAnchor.current.set(x, y);
          onAnchor(x, y);
        }
      }
    }
    if (difference > 0.002) invalidate();
  });

  return <group ref={group} dispose={null} />;
}
