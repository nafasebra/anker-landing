import { gsap } from "../animations/gsap";
import { poses } from "./poses";
import { smooth } from "./animation";

export const poseKeys = Object.keys(poses[0]) as (keyof (typeof poses)[number])[];

// Created inside useGSAP, never during React rendering. Seeking does not run a ticker loop.
export function createPoseTimeline() {
  const pose = { ...poses[0] };
  const timeline = gsap.timeline({ paused: true, defaults: { ease: smooth, lazy: false } });

  for (let index = 0; index < poses.length - 1; index++) {
    const next = poses[index + 1];
    const start = index + 0.15;
    if (index === 6) {
      const { lid, earbudY, spread, seat, lay, ...composition } = next;
      timeline.to(pose, { ...composition, duration: 0.7 }, start);
      timeline.to(pose, { lid, duration: 0.3 }, start);
      // Turn the earbuds flat while elevated, then settle them into their wells.
      timeline.to(pose, { lay, duration: 0.28 }, 6.35);
      timeline.to(pose, { earbudY, spread, seat, duration: 0.3 }, 6.55);
    } else {
      timeline.to(pose, { ...next, duration: 0.7 }, start);
    }
  }

  let previousPhase = -1;
  return {
    pose,
    timeline,
    seek(phase: number) {
      if (phase !== previousPhase) {
        timeline.time(Math.min(phase, timeline.duration()), true);
        previousPhase = phase;
      }
      return pose;
    },
  };
}

export type PoseTimeline = ReturnType<typeof createPoseTimeline>;
