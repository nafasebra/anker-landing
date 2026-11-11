"use client";
import { useEffect, useState } from "react";
export function useSceneVisibility() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const change = () => {
      setVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);

  return visible;
}
