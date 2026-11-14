"use client";

import { useEffect, useRef } from "react";
import type { RootState } from "@react-three/fiber";
import * as THREE from "three";

export function useProductFrameTimer(invalidate: RootState["invalidate"]) {
  const timer = useRef<THREE.Timer | null>(null);

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

  return timer;
}
