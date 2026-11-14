"use client";

import { useEffect, useState } from "react";

const SCENE_LOAD_TIMEOUT = 1500;

export function useDeferredScene() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    const start = () => setReady(true);
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: SCENE_LOAD_TIMEOUT });
    } else {
      timeoutId = setTimeout(start, SCENE_LOAD_TIMEOUT);
    }

    window.addEventListener("scroll", start, { once: true, passive: true });

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      window.removeEventListener("scroll", start);
    };
  }, [ready]);

  return ready;
}
