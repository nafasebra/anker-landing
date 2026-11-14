export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[2, 5, 4]} intensity={3.5} color="#f4f7ff" />
      <directionalLight position={[-4, 0, 2]} intensity={2} color="#a1b1c5" />
      <directionalLight position={[3, 2, -3]} intensity={5} color="#467bc3" />
    </>
  );
}
