"use client";
import { useCallback, useRef } from "react";
export function useProductAnchor() {
  const connector = useRef<SVGPolylineElement>(null);
  const hotspot = useRef<SVGCircleElement>(null);
  const onAnchor = useCallback((x: number, y: number) => {
    const mobile = window.innerWidth < 768;
    const endX = mobile ? 60 : 79;
    const endY = mobile ? 49 : 68;
    connector.current?.setAttribute("points", `${x},${y} ${endX - 4},${endY} ${endX - 1},${endY}`);
    hotspot.current?.setAttribute("cx", String(x));
    hotspot.current?.setAttribute("cy", String(y));
  }, []);

  return { connector, hotspot, onAnchor };
}
