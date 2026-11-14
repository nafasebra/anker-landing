export type SceneMotion = { phase: number };
export type ProductSceneProps = { onAnchor: (x: number, y: number) => void };

export type Pose = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rz: number;
  scale: number;
  center: number;
  buds: number;
  spread: number;
  lid: number;
  case: number;
  earbudY: number;
  seat: number;
  lay: number;
};
