import * as THREE from "three";
import { poses } from "./poses";
import type { Pose, SceneMotion } from "../types";
import type { ModelObjects } from "./model-objects";

export const smooth = (n: number) => n * n * (3 - 2 * n);

export function getTargetPose(
  phase: number,
  reduced: boolean,
  width: number,
  viewportWidth: number,
): Pose {
  const mobile = width < 768;
  const floor = Math.floor(phase);
  const a = poses[floor],
    b = poses[Math.min(floor + 1, 7)];
  const t = smooth(THREE.MathUtils.clamp((phase - floor - 0.15) / 0.7, 0, 1));
  const target = {} as Pose;
  for (const key of Object.keys(a) as (keyof Pose)[])
    target[key] = THREE.MathUtils.lerp(a[key], b[key], t);
  // Open the lid first, then lower both earbuds onto the charging contacts.
  if (floor === 6) {
    const open = smooth(THREE.MathUtils.clamp((phase - 6.15) / 0.3, 0, 1));
    const dock = smooth(THREE.MathUtils.clamp((phase - 6.4) / 0.45, 0, 1));
    target.lid = THREE.MathUtils.lerp(a.lid, b.lid, open);
    target.earbudY = THREE.MathUtils.lerp(a.earbudY, b.earbudY, dock);
    target.spread = THREE.MathUtils.lerp(a.spread, b.spread, dock);
    target.seat = dock;
  }
  if (reduced)
    Object.assign(target, phase > 6.5 ? poses[7] : phase < 1 ? poses[0] : poses[6], {
      x: phase > 6.5 ? -1.55 : phase > 1.5 ? 1.35 : 0,
    });
  if (mobile) {
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
  interactive: boolean,
) {
  const { model, left, right, hinge, caseGroup } = objects;
  const phase = THREE.MathUtils.clamp(motion.phase, 0, 7);
  group.position.set(p.x, p.y, 0);
  const pointer = (!reduced && phase < 1) || interactive ? motion.pointerX : 0;
  group.rotation.set(p.rx + (phase < 1 && !reduced ? motion.pointerY : 0), p.ry + pointer, p.rz);
  group.scale.setScalar(p.scale);
  model.position.y = -p.center;
  left.visible = right.visible = p.buds > 0.02;
  left.scale.setScalar(Math.max(0.001, p.buds));
  const closeup = 1 - p.case;
  right.scale.setScalar(Math.max(0.001, p.buds * (1 - closeup * 0.33)));
  const earbudHeight = p.earbudY;
  left.position.set(
    THREE.MathUtils.lerp(-0.022 - p.spread, -0.004, closeup),
    earbudHeight,
    0.00705 * p.seat,
  );
  right.position.set(
    THREE.MathUtils.lerp(0.022 + p.spread, 0.036, closeup),
    earbudHeight + closeup * 0.005,
    -closeup * 0.018 + 0.00705 * p.seat,
  );
  left.rotation.set(
    0.04 * (1 - p.seat),
    -0.2 * smooth(Math.max(0, 1 - Math.abs(phase - 3))) * (1 - p.seat),
    0.31 * (1 - p.seat),
  );
  right.rotation.set(-0.1 * (1 - p.seat), 0.15 * (1 - p.seat), -0.31 * (1 - p.seat));
  hinge.rotation.x = p.lid;
  caseGroup.visible = p.case > 0.02;
  caseGroup.scale.setScalar(Math.max(0.001, p.case));
  caseGroup.position.y = -0.045 * (1 - p.case);
}
