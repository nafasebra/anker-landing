import * as THREE from "three";
import { poses } from "./poses";
import type { Pose, SceneMotion } from "../types";
import type { ModelObjects } from "./model-objects";

export const smooth = (n: number) => n * n * (3 - 2 * n);

// Reuse the output object so settling frames do not allocate pose objects.
export function getResponsivePose(
  base: Pose,
  phase: number,
  reduced: boolean,
  width: number,
  viewportWidth: number,
  target: Pose,
): Pose {
  Object.assign(target, base);
  if (reduced)
    Object.assign(target, phase > 6.5 ? poses[7] : phase < 1 ? poses[0] : poses[6], {
      x: phase > 6.5 ? -1.55 : phase > 1.5 ? 1.35 : 0,
    });
  if (width < 768) {
    target.x = 0;
    target.scale *= 0.69 * Math.min(1, viewportWidth / 3.15);
    target.y = phase < 0.5 ? -0.3 : 0.65;
  }
  return target;
}

export function applyProductPose(
  group: THREE.Group,
  objects: ModelObjects,
  p: Pose,
  motion: SceneMotion,
  reduced: boolean,
) {
  const { model, left, right, hinge, caseGroup } = objects;
  const phase = THREE.MathUtils.clamp(motion.phase, 0, 7);
  group.position.set(p.x, p.y, 0);
  const pointer = !reduced && phase < 1 ? motion.pointerX : 0;
  group.rotation.set(p.rx + (phase < 1 && !reduced ? motion.pointerY : 0), p.ry + pointer, p.rz);
  group.scale.setScalar(p.scale);
  model.position.y = -p.center;
  left.visible = right.visible = p.buds > 0.02;
  left.scale.setScalar(Math.max(0.001, p.buds));
  const closeup = 1 - p.case;
  right.scale.setScalar(Math.max(0.001, p.buds * (1 - closeup * 0.33)));
  const earbudHeight = p.earbudY;
  // A -90° X turn lays the stems along the tray (+Z), with touch faces upward (+Y).
  // The seated Z offset aligns the authored earbud contacts with the case pins.
  left.position.set(
    THREE.MathUtils.lerp(-0.022 - p.spread, -0.004, closeup),
    earbudHeight,
    -0.0018 * p.seat,
  );
  right.position.set(
    THREE.MathUtils.lerp(0.022 + p.spread, 0.036, closeup),
    earbudHeight + closeup * 0.005,
    -closeup * 0.018 - 0.0018 * p.seat,
  );
  left.rotation.set(
    THREE.MathUtils.lerp(0.04, -Math.PI / 2, p.lay),
    -0.2 * smooth(Math.max(0, 1 - Math.abs(phase - 3))) * (1 - p.lay),
    0.31 * (1 - p.lay),
  );
  right.rotation.set(
    THREE.MathUtils.lerp(-0.1, -Math.PI / 2, p.lay),
    0.15 * (1 - p.lay),
    -0.31 * (1 - p.lay),
  );
  hinge.rotation.x = p.lid;
  caseGroup.visible = p.case > 0.02;
  caseGroup.scale.setScalar(Math.max(0.001, p.case));
  caseGroup.position.y = -0.045 * (1 - p.case);
}
