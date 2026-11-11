import { Environment, Lightformer } from "@react-three/drei";
export function StudioLights() {
  return (
    <>
      {" "}
      <ambientLight intensity={0.65} />
      <directionalLight position={[2, 5, 4]} intensity={3.5} color="#f4f7ff" />
      <directionalLight position={[-4, 0, 2]} intensity={2} color="#a1b1c5" />
      <directionalLight position={[3, 2, -3]} intensity={5} color="#467bc3" />
    </>
  );
}
export function StudioEnvironment() {
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer
        form="rect"
        intensity={6}
        position={[0, 4, 2]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[8, 3, 1]}
      />
      <Lightformer
        form="rect"
        intensity={4}
        position={[-4, 1, 2]}
        rotation={[0, Math.PI / 3, 0]}
        scale={[2, 7, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3}
        position={[4, 1, 0]}
        rotation={[0, -Math.PI / 3, 0]}
        scale={[1, 6, 1]}
        color="#74aaff"
      />
    </Environment>
  );
}
