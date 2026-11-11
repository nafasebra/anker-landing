"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

export type SceneMotion = { phase: number; pointerX: number; pointerY: number; reset: number };
type Props = { motion: MutableRefObject<SceneMotion>; invalidateRef: MutableRefObject<() => void>; reduced: boolean; interactive: boolean; onLoaded: () => void; onError: () => void; onAnchor: (x: number, y: number) => void };

// Inspected GLB: meters, Y up, front +Z. Lid_Hinge opens around -X.
// Updated asset includes a charging tray and wells; retain the low-angle reveal.
const MODEL_URL = "/models/soundcore-r50i.glb?v=cce61a7bdfc3";
const poses = [
  { x: 0, y: -.7, rx: .42, ry: -.32, rz: -.06, scale: 40, center: .027, buds: 1, spread: 0, lid: -1.35, case: 1, earbudY: .040, seat: 0 },
  { x: .9, y: -.5, rx: -.10, ry: -.28, rz: .03, scale: 43, center: .042, buds: 1, spread: .008, lid: -.95, case: 1, earbudY: .076, seat: 0 },
  { x: 1.35, y: -.05, rx: .12, ry: -.25, rz: -.12, scale: 65, center: .065, buds: 1, spread: .005, lid: 0, case: 0, earbudY: .076, seat: 0 },
  { x: 1.4, y: -.05, rx: .2, ry: -1.1, rz: -.2, scale: 68, center: .065, buds: 1, spread: .008, lid: 0, case: 0, earbudY: .076, seat: 0 },
  { x: 1.4, y: -.05, rx: -.06, ry: .12, rz: .12, scale: 70, center: .065, buds: 1, spread: .006, lid: 0, case: 0, earbudY: .076, seat: 0 },
  { x: 1.4, y: -.1, rx: .28, ry: -.45, rz: -.12, scale: 44, center: .029, buds: .001, spread: 0, lid: 0, case: 1, earbudY: .076, seat: 0 },
  { x: 1.15, y: -.1, rx: .1, ry: -.28, rz: -.06, scale: 43, center: .05, buds: 1, spread: .009, lid: 0, case: 1, earbudY: .076, seat: 0 },
  { x: -1.55, y: -.05, rx: .42, ry: .28, rz: -.08, scale: 43, center: .032, buds: 1, spread: -.008, lid: -1.35, case: 1, earbudY: .0284, seat: 1 },
];
type Pose = typeof poses[number];
const smooth = (n: number) => n * n * (3 - 2 * n);

function Model({ motion, invalidateRef, reduced, interactive, onLoaded, onAnchor }: Props) {
  const { scene } = useGLTF(MODEL_URL);
  const { invalidate, viewport, camera, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const controls = useRef<OrbitControlsType>(null);
  const previousReset = useRef(0);
  const current = useRef<Pose>({ ...poses[0] });
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const objects = useMemo(() => {
    const model = scene.clone(true);
    const left = model.getObjectByName("Earbud_Left")!;
    const right = model.getObjectByName("Earbud_Right")!;
    const hinge = model.getObjectByName("Lid_Hinge")!;
    const caseGroup = new THREE.Group();
    model.children.filter(child => child !== left && child !== right).forEach(child => caseGroup.add(child));
    model.add(caseGroup);
    const materials: THREE.MeshStandardMaterial[] = [];
    model.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.material = object.material.clone();
        const material = object.material as THREE.MeshStandardMaterial;
        material.envMapIntensity = 1.5;
        materials.push(material);
      }
    });
    left.visible = right.visible = true;
    return { model, left, right, hinge, caseGroup, materials };
  }, [scene]);
  const { model, materials } = objects;
  // Three.js objects are mutable scene state, owned by the animation loop.
  const animatedObjects = useRef<typeof objects | null>(null);

  useEffect(() => {
    animatedObjects.current = objects;
    return () => { animatedObjects.current = null; };
  }, [objects]);

  useEffect(() => { invalidateRef.current = invalidate; onLoaded(); return () => { invalidateRef.current = () => {}; materials.forEach(m => m.dispose()); }; }, [invalidate, invalidateRef, materials, onLoaded]);
  useEffect(() => { if (!interactive) controls.current?.reset(); invalidate(); }, [interactive, invalidate]);

  useFrame((_, delta) => {
    if (!group.current || !animatedObjects.current || document.hidden) return;
    const { model, left, right, hinge, caseGroup } = animatedObjects.current;
    const phase = THREE.MathUtils.clamp(motion.current.phase, 0, 7);
    const mobile = size.width < 768;
    const floor = Math.floor(phase);
    const a = poses[floor], b = poses[Math.min(floor + 1, 7)];
    const t = smooth(THREE.MathUtils.clamp((phase - floor - .15) / .7, 0, 1));
    const target = {} as Pose;
    for (const key of Object.keys(a) as (keyof Pose)[]) target[key] = THREE.MathUtils.lerp(a[key], b[key], t);
    // Open the lid first, then lower both earbuds onto the charging contacts.
    if (floor === 6) {
      const open = smooth(THREE.MathUtils.clamp((phase - 6.15) / .3, 0, 1));
      const dock = smooth(THREE.MathUtils.clamp((phase - 6.4) / .45, 0, 1));
      target.lid = THREE.MathUtils.lerp(a.lid, b.lid, open);
      target.earbudY = THREE.MathUtils.lerp(a.earbudY, b.earbudY, dock);
      target.spread = THREE.MathUtils.lerp(a.spread, b.spread, dock);
      target.seat = dock;
    }
    if (reduced) Object.assign(target, phase > 6.5 ? poses[7] : phase < 1 ? poses[0] : poses[6], { x: phase > 6.5 ? -1.55 : phase > 1.5 ? 1.35 : 0 });
    if (mobile) { target.x = 0; target.scale *= .69 * Math.min(1, viewport.width / 3.15); target.y = phase < .5 ? -.3 : .65; }
    let difference = 0;
    const lerp = reduced ? 1 : 1 - Math.exp(-Math.min(delta, .05) * 10);
    for (const key of Object.keys(target) as (keyof Pose)[]) {
      current.current[key] = THREE.MathUtils.lerp(current.current[key], target[key], lerp);
      difference += Math.abs(current.current[key] - target[key]);
    }
    const p = current.current;
    group.current.position.set(p.x, p.y, 0);
    const pointer = ((!reduced && phase < 1) || interactive) ? motion.current.pointerX : 0;
    group.current.rotation.set(p.rx + (phase < 1 && !reduced ? motion.current.pointerY : 0), p.ry + pointer, p.rz);
    group.current.scale.setScalar(p.scale);
    model.position.y = -p.center;
    left.visible = right.visible = p.buds > .02;
    left.scale.setScalar(Math.max(.001, p.buds));
    const closeup = 1 - p.case;
    right.scale.setScalar(Math.max(.001, p.buds * (1 - closeup * .33)));
    const earbudHeight = p.earbudY;
    left.position.set(THREE.MathUtils.lerp(-.022 - p.spread, -.004, closeup), earbudHeight, .00705 * p.seat);
    right.position.set(THREE.MathUtils.lerp(.022 + p.spread, .036, closeup), earbudHeight + closeup * .005, -closeup * .018 + .00705 * p.seat);
    left.rotation.set(.04 * (1 - p.seat), -.2 * smooth(Math.max(0, 1 - Math.abs(phase - 3))) * (1 - p.seat), .31 * (1 - p.seat));
    right.rotation.set(-.1 * (1 - p.seat), .15 * (1 - p.seat), -.31 * (1 - p.seat));
    hinge.rotation.x = p.lid;
    caseGroup.visible = p.case > .02;
    caseGroup.scale.setScalar(Math.max(.001, p.case));
    caseGroup.position.y = -.045 * (1 - p.case);
    const highlight = phase > 1.7 && phase < 4.7 ? Math.round(phase) : -1;
    const partName = highlight === 2 ? "Left_Organic_Housing" : highlight === 3 ? "Left_Silicone_Tip" : highlight === 4 ? "Left_Touch_Surface" : "";
    model.traverse(object => {
      if (object instanceof THREE.Mesh) {
        const mat = object.material as THREE.MeshStandardMaterial;
        mat.emissive.set(object.name === partName ? "#1678c8" : "#000000");
        mat.emissiveIntensity = object.name === partName ? .18 : 0;
      }
    });
    if (phase > 1.65 && phase < 5.55) {
      const part = model.getObjectByName(partName || "Case_Base");
      if (part) {
        group.current.updateWorldMatrix(true, true);
        part.getWorldPosition(anchor);
        anchor.project(camera);
        onAnchor((anchor.x * .5 + .5) * 100, (-anchor.y * .5 + .5) * 100);
      }
    }
    if (motion.current.reset !== previousReset.current) {
      controls.current?.reset();
      previousReset.current = motion.current.reset; invalidate();
    }
    if (difference > .002) invalidate();
  });

  return <>
    <group ref={group}><primitive object={model} /></group>
    <OrbitControls ref={controls} enabled={interactive} enableZoom={false} enablePan={false} enableDamping={false} minPolarAngle={Math.PI * .32} maxPolarAngle={Math.PI * .65} rotateSpeed={.65} target={[0, 0, 0]} />
  </>;
}

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function ProductScene(props: Props) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const change = () => { setVisible(!document.hidden); props.invalidateRef.current(); };
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, [props.invalidateRef]);
  return <SceneBoundary onError={props.onError}><Canvas frameloop={visible ? "demand" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0, 9], fov: 35, near: .1, far: 50 }} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.25; gl.domElement.addEventListener("webglcontextlost", props.onError, { once: true }); }}>
    <ambientLight intensity={.65} />
    <directionalLight position={[2, 5, 4]} intensity={3.5} color="#f4f7ff" />
    <directionalLight position={[-4, 0, 2]} intensity={2} color="#a1b1c5" />
    <directionalLight position={[3, 2, -3]} intensity={5} color="#467bc3" />
    <Suspense fallback={null}>
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={6} position={[0, 4, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={4} position={[-4, 1, 2]} rotation={[0, Math.PI / 3, 0]} scale={[2, 7, 1]} />
        <Lightformer form="rect" intensity={3} position={[4, 1, 0]} rotation={[0, -Math.PI / 3, 0]} scale={[1, 6, 1]} color="#74aaff" />
      </Environment>
      <Model {...props} />
    </Suspense>
  </Canvas></SceneBoundary>;
}
